pipeline {
  agent any

  environment {
    CREDS = credentials('dockerhub-credentials')
    DOCKERHUB_USER = "${CREDS_USR}"
    TAG = '' // GitHub tag
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Detect Git Tag & Changed Services') {
      steps {
        script {
          TAG = sh(script: "git describe --tags --exact-match || echo ''", returnStdout: true).trim()
          if (!TAG) {
            error("❌ Không phải Git tag. Dừng pipeline.")
          }
          env.TAG = TAG

          def lastTag = sh(script: "git describe --tags --abbrev=0 HEAD^", returnStdout: true).trim()
          def changed = sh(script: "git diff --name-only ${lastTag}..HEAD", returnStdout: true).trim()
          def list = changed.split("\n")
                            .findAll { it.startsWith("services/") }
                            .collect { it.split("/")[1] }
                            .unique()
          if (list.isEmpty()) {
            echo "✅ Không có service nào thay đổi. Dừng pipeline."
            currentBuild.result = 'SUCCESS'
            return
          }
          env.CHANGED_SERVICES = list.join(",")
          echo "📦 Sẽ build các service thay đổi: ${env.CHANGED_SERVICES}"
        }
      }
    }

    stage('Generate Minimal Compose File') {
      steps {
        script {
          def changed = env.CHANGED_SERVICES.split(',')
          def composeLines = [ 'version: "3.8"', '', 'services:' ]
          for (svc in changed) {
            composeLines += """
  ${svc}:
    build: ./services/${svc}
    image: ${DOCKERHUB_USER}/${svc}:${TAG}
"""
          }
          writeFile file: 'docker-compose.partial.yml', text: composeLines.join('\n')
        }
      }
    }

    stage('Build & Push Changed Images') {
      steps {
        sh """
          echo $CREDS_PSW | docker login -u $DOCKERHUB_USER --password-stdin
          TAG=${TAG} docker compose -f docker-compose.partial.yml build
          TAG=${TAG} docker compose -f docker-compose.partial.yml push
          docker logout
        """
      }
    }
  }
}