import groovy.json.JsonSlurper;

pipeline {
  agent any
  triggers{
    GenericTrigger(
      // 构建时的标题
      causeString: 'Triggered by $ref',
      // 获取 POST 参数中的变量，key 指的是变量名，通过$ref来访问对应的值，value指的是JSON匹配值（参考Jmeter的JSON提取器）
      // ref 指的是推送的分支，格式如：refs/heads/master
      genericVariables: [
        [key: 'ref', value: '$.ref', regexpFilter: 'refs/heads/'],
        [key: 'commit_message', value: '$.head_commit.message'],
        // head_commit.modified 是本次提交修改的文件列表
        [key: 'modified', value: '$.head_commit.modified'],
      ],
      // 与 git webhook 中 payload url 参数中配置的 token 值一致
      token: 'aitwebconfigcenter',
      // 打印获取的变量的 key-value，此处会打印如：ref=refs/heads/master
      printContributedVariables: true,
      // 打印 POST 传递的参数
      printPostContent: true,
      silentResponse: false,
      // 将变量 ref 赋值给 regexpFilterText
      regexpFilterText: '$ref;$ref;$commit_message',
      // regexpFilterExpression 与 regexpFilterExpression 成对使用
      // regexpFilterExpression 会对 regexpFilterText 的内容进行验证
      regexpFilterExpression: '^(master|dev);' + BRANCH_NAME + ';build: '
    )
  }

  stages {
    stage('output variables defined in Generic-Webhook-Trigger plugin') {
      steps {
        script {
          echo "ref: ${ref};";
          echo "commit_message: ${commit_message}";
          echo "modified: ${modified}";
        }
      }
    }

    stage('declare environment variables') {
      steps {
        script {
          // 定义 JSON 对象
          def json = new JsonSlurper();
          def hasNpmInstall = false;
          // modified 是一个字符串，类似这样："['src/index.js', 'package.json']"
          // 通过 JSON 将其转换成对象的形式。
          def modifiedFiles = json.parseText(modified);

          for (item in modifiedFiles) {
            echo "${item}";
            // 如果发现本次提交的内容中含有 package.json 文件，则需要重新执行 npm install 或者 yarn install。
            if (item == "package.json") {
              hasNpmInstall = true;
              break;
            }
          }
          // 最后将本地变量添加到全局环境中。这样在其他的 stage 中就可以访问这个值了。
          env.hasNpmInstall = hasNpmInstall;
        }
      }
    }

    stage ('Build Development') {
      when {
        branch 'dev'
      }
      steps {
        script {
          def dt = new Date();
          def time = dt.toString();

          dingtalk (
            robot: '4ca66784-8955-4dd2-aa78-8294f71cbaac',
            type: 'TEXT',
            text: [
              "aitweb-config-center is building...",
              "${GIT_COMMIT}",
              "build branch ${GIT_BRANCH}",
              "build start at ${time}",
              ""
            ],
            at: [ "${GIT_COMMITTER_NAME}" ]
          );

          echo "has npm install ${hasNpmInstall}";

          sh '''
            if ( "${hasNpmInstall}" == true ); then
              yarn install;
            fi

            npm run build;
            rm -rf /usr/share/nginx/dist;
            mv ./dist /usr/share/nginx/dist;
          ''';
        }
      }
    }
    stage ('Build Production') {
      when {
        branch 'master'
      }
      steps {
        script {
          def dt = new Date();
          def time = dt.toString();
          dingtalk (
            robot: '4ca66784-8955-4dd2-aa78-8294f71cbaac',
            type: 'TEXT',
            text: [
              "aitweb-config-center is building...",
              "${GIT_COMMIT}",
              "build branch ${GIT_BRANCH}",
              "build started at ${time}",
              ""
            ],
            at: [ "${GIT_COMMITTER_NAME}" ]
          );

          echo "has npm install ${hasNpmInstall}";

          sh '''
            if ( "${hasNpmInstall}" == true ); then
              yarn install;
            fi

            npm run build;
            rm -rf /usr/share/nginx/dist;
            mv ./dist /usr/share/nginx/dist;
          ''';
        }
      }
    }
  }

  post {
    success {
      script {
        def dt = new Date();
        def time = dt.toString();
        dingtalk (
          robot: '4ca66784-8955-4dd2-aa78-8294f71cbaac',
          type: 'TEXT',
          text: [
            "aitweb-config-center is build completed",
            "${GIT_COMMIT}",
            "build branch ${GIT_BRANCH}",
            "build completed at ${time}",
            "",
          ],
          at: [ "${GIT_COMMITTER_NAME}" ]
        );
      }
    }

    failure {
      script {
        def dt = new Date();
        def time = dt.toString();

        dingtalk (
          robot: '4ca66784-8955-4dd2-aa78-8294f71cbaac',
          type: 'TEXT',
          text: [
            "aitweb-config-center is build failed",
            "${GIT_COMMIT}",
            "build branch ${GIT_BRANCH}",
            "build failed at ${time}",
            "",
          ],
          at: [ "${GIT_COMMITTER_NAME}" ]
        );
      }
    }
  }
}
