group "default" {
  targets = ["f1-dash", "f1-dash-api", "f1-dash-realtime"]
}

target "docker-metadata-action" {}

// actual servives and images below

target "f1-dash" {
  inherits = ["docker-metadata-action"]

  context = "./dashboard"
  dockerfile = "dockerfile"

  platforms = ["linux/amd64", "linux/arm64"]

  tags = ["ghcr.io/slowlydev/f1-dash:latest"]
}

target "f1-dash-api" {
  inherits = ["docker-metadata-action"]

  context = "."
  dockerfile = "dockerfile"
  target = "api"

  platforms = ["linux/amd64", "linux/arm64"]

  tags = ["ghcr.io/slowlydev/f1-dash-api:latest"]
}

target "f1-dash-realtime" {
  inherits = ["docker-metadata-action"]

  context = "."
  dockerfile = "dockerfile"
  target = "realtime"

  platforms = ["linux/amd64", "linux/arm64"]

  tags = ["ghcr.io/slowlydev/f1-dash-realtime:latest"]
}
