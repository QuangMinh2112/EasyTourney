pipeline {
    agent {
        label 'linux-node'
    }
    tools { nodejs "Node18" }
    stages {
        stage('Install deps') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Deploy') {
            when {
                anyOf {
                    branch 'master'
                }
            }
            steps {
                sshagent(['ci-user-ssh']) {
                    sh 'scp -r -o StrictHostKeyChecking=no ./build/* easytourney@easy-tourney.mgm-edv.de:/var/www/html'
                }
            }
        }
    }
}