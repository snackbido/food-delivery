pipeline {
  agent any

  environment {
    REGISTRY = 'docker.io/harukiraito'
    CREDS = credentials('dockerhub-credentials')
    TAG = ''
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
          TAG = sh(script: "git describe --tags --exact-match || echo 'latest'", returnStdout: true).trim()
          env.TAG = TAG
          echo "🏷️ Sử dụng tag: ${TAG}"
        }
      }
    }

    stage('Build & Push (sequentially)') {
      steps {
        script {
          // Danh sách service cần build (có thể lọc ra service có build context)
          def services = [
            "auth", "user", "notification",
            "restaurant", "order", "payment",
            "delivery", "cart", "review",
            "api-gateway"
          ]

          for (svc in services) {
            echo "🐳 Building service: ${svc}"

            def path = "services/${svc}-service"
            if (svc == "api-gateway") {
              path = "services/api-gateway"
            }

            def image = "${REGISTRY}/${svc}:${TAG}"

            // Viết docker-compose tạm thời
            def compose = """
            version: '3.8'
            services:
              ${svc}:
                build: ${path}
                image: ${image}
            """.stripIndent()

            writeFile file: "docker-compose-${svc}.yml", text: compose

            sh """
              echo $CREDS_PSW | docker login -u $CREDS_USR --password-stdin
              TAG=${TAG} docker-compose -f docker-compose-${svc}.yml build
              TAG=${TAG} docker-compose -f docker-compose-${svc}.yml push
              docker logout
            """
          }
        }
      }
    }
  }
}