FROM node:10.15.3-jessie-slim

RUN node -v && npm -v

RUN apt-get update && apt-get install -y \
  wget \
  unzip \
  && rm -rf /var/lib/apt/lists/*

# Install Terraform
RUN wget --quiet https://releases.hashicorp.com/terraform/0.12.0/terraform_0.12.0_linux_amd64.zip \
  && unzip terraform_0.12.0_linux_amd64.zip \
  && mv terraform /usr/bin \
  && rm terraform_0.12.0_linux_amd64.zip

RUN terraform -v
