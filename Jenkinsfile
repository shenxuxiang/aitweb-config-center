pipeline {
  agent any
  triggers{
    GenericTrigger(
      // 构建时的标题
      causeString: 'Triggered by $ref',
      // 获取 POST 参数中的变量，key 指的是变量名，通过$ref来访问对应的值，value指的是JSON匹配值（参考Jmeter的JSON提取器）
      // ref 指的是推送的分支，格式如：refs/heads/master
      genericVariables: [
        [key: 'ref', value: '$.ref'],
        [key: 'commit_message', value: '$.head_commit.message']
      ],
      // 与 git webhook 中 payload url 参数中配置的 token 值一致
      token: 'aitwebconfigcenter',
      // 打印获取的变量的 key-value，此处会打印如：ref=refs/heads/master
      printContributedVariables: true,
      // 打印 POST 传递的参数
      printPostContent: true,
      silentResponse: false,
      // 将变量 ref 赋值给 regexpFilterText
      regexpFilterText: '$ref; $commit_message',
      // regexpFilterExpression 与 regexpFilterExpression 成对使用
      // regexpFilterExpression 会对 regexpFilterText 的内容进行验证
      regexpFilterExpression: '^refs/heads/(pl|dev)$'
    )
  }

  // // 定义了超时时间为 300s
  // options {
  //     timeout(time: 300, unit: 'SECONDS');
  // }

  // // 定义了 environment 可选参数，
  // parameters {
  //     choice choices: ['development', 'production', 'prerelease'], name: 'environment'
  // }

  // environment {
  //   build_env = "development"
  // }

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
          dingtalk (
            robot: '4ca66784-8955-4dd2-aa78-8294f71cbaac',
            type: 'TEXT',
            text: [
              "【aitweb-config-center】正在打包",
              "Build Branch【${GIT_BRANCH}】",
              "Commit ID【${GIT_COMMIT}】",
              "",
            ],
            at: [
              "${GIT_COMMITTER_NAME}"
            ]
          );

          sh '''
            yarn install;
            npm run build;
            rm -rf /usr/share/nginx/dist;
            mv ./dist /usr/share/nginx/dist;
          '''
        }
      }
    }
  }

  post {
    success {
      script {
        dingtalk (
          robot: '4ca66784-8955-4dd2-aa78-8294f71cbaac',
          type: 'TEXT',
          text: [
            "【aitweb-config-center】构建成功",
            "Build Branch【${GIT_BRANCH}】",
            "Commit ID【${GIT_COMMIT}】",
            "Pusher【${GIT_COMMITTER_NAME}】",
            "",
          ],
          at: [
            "${GIT_COMMITTER_NAME}"
          ]
        );
      }
    }

    failure {
      script {
        dingtalk (
          robot: '4ca66784-8955-4dd2-aa78-8294f71cbaac',
          type: 'TEXT',
          text: [
            "【aitweb-config-center】构建失败",
            "Build Branch【${GIT_BRANCH}】",
            "Commit ID【${GIT_COMMIT}】",
            "Pusher【${GIT_COMMITTER_NAME}】",
            "",
          ],
          at: [
            "${GIT_COMMITTER_NAME}"
          ]
        );
      }
    }
  }
}
