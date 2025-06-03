pipeline {
    agent any

    tools {
        nodejs 'NodeJS_22'
    }

    stages {

        stage('Checkout') {
            steps {
                git url: 'https://github.com/jlcarrascof/selenium-jest-suite.git', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run UI Tests') {
            steps {
                bat 'npm run test:e2e'
            }
        }
    }

    post {
        success {
            echo '✅ All tests  running with success'
        }
        failure {
            echo '❌  Some tests are failing'
        }
    }
}
