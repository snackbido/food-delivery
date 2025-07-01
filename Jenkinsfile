pipeline {
  agent any

  parameters {
    booleanParam(name: 'FORCE_ALL', defaultValue: false, description: 'Build tất cả service bất kể có thay đổi hay không')
  }

  environment {
    CREDS = credentials('dockerhub-credentials')
    DOCKERHUB_USER = "${CREDS_USR}"
    TAG = ''
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
          // 1. Lấy tag hiện tại
          def tag = sh(script: "git describe --tags --exact-match || echo ''", returnStdout: true).trim()
          if (!tag) {
            error("⛔ Không phải Git tag. Dừng pipeline.")
          }
          env.TAG = tag
          echo "🏷️ Git tag hiện tại: ${tag}"

          // 2. Nếu FORCE_ALL = true → build toàn bộ service
          if (params.FORCE_ALL) {
            def allSvcs = sh(script: 'ls services', returnStdout: true).trim().split("\n")
            env.CHANGED_SERVICES = allSvcs.join(',')
            echo "🚨 FORCE_ALL = true → build tất cả: ${env.CHANGED_SERVICES}"
            return
          }

          // 3. Tìm Git tag trước đó
          def lastTag = sh(script: "git describe --tags --abbrev=0 HEAD^ 2>/dev/null || echo ''", returnStdout: true).trim()
          def changedSvcs = []

          if (lastTag) {
            echo "🔍 So sánh với tag trước đó: ${lastTag}"
            def diff = sh(script: "git diff --name-only ${lastTag}..HEAD", returnStdout: true).trim().split("\n")
            changedSvcs = diff.findAll { it.startsWith('services/') }
                              .collect { it.split('/')[1] }
                              .unique()
          } else {
            echo "🆕 Không tìm thấy tag trước đó → lần đầu chạy. Build toàn bộ service."
            changedSvcs = sh(script: 'ls services', returnStdout: true).trim().split("\n")
          }

          if (changedSvcs.isEmpty()) {
            echo "✅ Không có service nào thay đổi. Dừng pipeline."
            currentBuild.result = 'SUCCESS'
            error('Skip build')
          }

          env.CHANGED_SERVICES = changedSvcs.join(',')
          echo "📦 Danh sách service sẽ build: ${env.CHANGED_SERVICES}"
        }
      }
    }

    stage('Generate Compose File Cho Services Thay Đổi') {
      steps {
        script {
          def svcs = env.CHANGED_SERVICES.split(',')
          def compose = ['version: "3.8"', '', 'services:']
          for (svc in svcs) {
            compose += """
  ${svc}:
    build: ./services/${svc}
    image: ${DOCKERHUB_USER}/${svc}:${TAG}
"""
          }
          writeFile file: 'docker-compose.partial.yml', text: compose.join('\n')
          sh 'cat docker-compose.partial.yml'
        }
      }
    }

    stage('Build & Push Docker Images') {
      steps {
        sh """
          echo $CREDS_PSW | docker login -u $DOCKERHUB_USER --password-stdin
          TAG=${TAG} docker-compose -f docker-compose.partial.yml build
          TAG=${TAG} docker-compose -f docker-compose.partial.yml push
          docker logout
        """
      }
    }
  }
}