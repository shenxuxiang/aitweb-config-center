pipeline {
  agent any
  triggers{
    GenericTrigger(
      // 构建时的标题
      causeString: 'Triggered by $ref',
      // 获取 POST 参数中的变量，key 指的是变量名，通过$ref来访问对应的值，value指的是JSON匹配值（参考Jmeter的JSON提取器）
      // ref 指的是推送的分支，格式如：refs/heads/master
      genericVariables: [[key: 'ref', value: '$.ref']],
      // 与 git webhook 中 payload url 参数中配置的 token 值一致
      token: 'aitwebconfigcenter',
      // 打印获取的变量的 key-value，此处会打印如：ref=refs/heads/master
      printContributedVariables: true,
      // 打印 POST 传递的参数
      printPostContent: true,
      silentResponse: false,
      // 将变量 ref 赋值给 regexpFilterText
      regexpFilterText: '$ref',
      // regexpFilterExpression 与 regexpFilterExpression 成对使用
      // regexpFilterExpression 会对 regexpFilterText 的内容进行验证
      regexpFilterExpression: '^refs/heads/(master|pl|dev)$'
    )
  }

  environment {
    build_env = "development"
  }

  stages {
    stage('Build Development') {
      when {
        branch 'dev'
      }
      steps {
        sh '''
          echo "author: $(whoami)";
          echo "environment development";
          yarn install;
          npm run build;
          rm -rf /usr/share/nginx/dist;
          mv ./dist /usr/share/nginx/dist;
        '''
      }
    }
    stage ('Build Production') {
      when {
        branch 'master'
      }
      steps {
        script {
          commit_message = getCommitMessage();
          author = getAuthorName();
          env.build_env = "production";
          env.commit_message = commit_message;
          env.author = author;
          sh '''
            # yarn install;
            # npm run build;
            # rm -rf /usr/share/nginx/dist;
            # mv ./dist /usr/share/nginx/dist;
          '''
        }
      }
    }
  }

  post {
    success {
      dingtalk (
        robot: '4ca66784-8955-4dd2-aa78-8294f71cbaac',
        type: 'TEXT',
        text: [
          "项目: aitweb-config-center",
          "打包环境: ${build_env}",
          'commit-msg: ${commit_message}; pusher: ${author}'
        ],
        at: [
          "${author}"
        ]
      )
    }
  }
}



@NonCPS
String getGitcommitID(){
    gitCommitID = " "
    for ( changeLogSet in currentBuild.changeSets){
        for (entry in changeLogSet.getItems()){
            gitCommitID = entry.commitId
        }
    }
    return gitCommitID
}

@NonCPS
String getAuthorName(){
    gitAuthorName = " "
    for ( changeLogSet in currentBuild.changeSets){
        for (entry in changeLogSet.getItems()){
            gitAuthorName = entry.authorName
        }
    }
    return gitAuthorName
}

@NonCPS
String getCommitMessage(){
  commitMessage = ""
  for ( changeLogSet in currentBuild.changeSets) {
    for (entry in changeLogSet.getItems()){
      commitMessage = entry.msg
    }
  }
  return commitMessage
}
