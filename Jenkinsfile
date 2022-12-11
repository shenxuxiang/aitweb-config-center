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
    author = "shenxuxiang"
    version = "1.0.0"
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
          String gitCommitMessage = getCommitMessage()
          env.commit_message = gitCommitMessage;

          sh '''
            echo "author: ${author}";
            echo "version: ${version}";
            echo "message: ${env.commit_message}";

            # yarn install;
            # npm run build;
            # rm -rf /usr/share/nginx/dist;
            #mv ./dist /usr/share/nginx/dist;
          '''

          echo "${author}";
          echo "${version}";
          echo "${env.commit_message}";
        }
      }
    }
  }
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