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
    stage('output git info') {
      steps {
        script {
          echo "ref: ${ref}; commit_message: ${commit_message}";
          echo "${GIT_BRANCH}";
          echo "modified: ${modified}";

          def json = new JsonSlurper();
          def hasInstall = false;
          def modifiedFiles = json.parseText(modified);

          for (item in modifiedFiles) {
            echo "${item}";
            if (item == "package.json") {
              hasInstall = true;
              break;
            }
          }
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

          echo "has install ${hasInstall}";

          sh '''
            if ( "${hasInstall}" == true ); then
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

          sh '''
            yarn install;
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
