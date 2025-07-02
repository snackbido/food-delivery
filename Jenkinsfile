pipeline {
  agent any

  environment {
    CREDS = credentials('dockerhub-credentials')
    DOCKERHUB_USER = "${CREDS_USR}"
    TAG = ''
    COMPOSE_FILE = 'infra/docker-compose.yaml'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Detect Git Tag') {
      steps {
        script {
          def tag = sh(script: "git describe --tags --exact-match || echo ''", returnStdout: true).trim()
          if (!tag) {
            error("🚫 Not found tag.")
          }
          TAG = tag
          env.TAG = TAG
          echo "📌Use tag: ${TAG}"
          echo "test"
        }
      }
    }

    stage('Build & Push via Docker Compose') {
      steps {
        script {
          dir("${env.WORKSPACE}") {
            sh """
              echo $CREDS_PSW | docker login -u $DOCKERHUB_USER --password-stdin
              TAG=${TAG} docker compose -f ${COMPOSE_FILE} build
              TAG=${TAG} docker compose -f ${COMPOSE_FILE} push
              docker logout
            """
          }
        }
      }
    }
  }
}