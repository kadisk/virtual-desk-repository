FROM node:22

ARG REPOSITORY_NAMESPACE

ARG REPOSITORY_CONTEXT_PATH=/context_data/repository
ARG STARTUP_JSON=/context_data/startup-params.json
ARG PACKAGE_PATH=/context_data/package

ARG USERNAME=myecosystem
# UID/GID do usuário do host (dono dos sockets/arquivos montados via HostMount).
# O container roda com esse UID/GID para acessar bind mounts do host sem EACCES.
ARG HOST_UID=1000
ARG HOST_GID=1000
ARG HOME_DIR_PATH=/home/${USERNAME}
ARG ECOSYSTEM_DATA_PATH=${HOME_DIR_PATH}/EcosystemData
ARG NODEJS_DEPS_PATH=${ECOSYSTEM_DATA_PATH}/npm-dependencies
ARG ECOSYSTEM_DEFAULT=${ECOSYSTEM_DATA_PATH}/config-files/ecosystem-defaults.json

RUN apt-get update && apt-get install -y sudo wget git \
    && rm -rf /var/lib/apt/lists/*

# O myecosystem roda com o UID/GID do host (dono dos sockets montados via HostMount).
# A imagem node:22 já ocupa o UID/GID 1000 com o usuário "node"; removemos qualquer usuário/grupo
# que ocupe o UID/GID alvo para que o myecosystem seja o ÚNICO dono desse UID (senão sudo/whoami
# resolvem para o outro nome e o NOPASSWD não se aplica).
RUN existing_user="$(getent passwd ${HOST_UID} | cut -d: -f1)"; \
    [ -n "$existing_user" ] && userdel -r "$existing_user" 2>/dev/null || true; \
    existing_group="$(getent group ${HOST_GID} | cut -d: -f1)"; \
    [ -n "$existing_group" ] && groupdel "$existing_group" 2>/dev/null || true; \
    groupadd -g ${HOST_GID} ${USERNAME} \
    && useradd -m -s /bin/bash -u ${HOST_UID} -g ${HOST_GID} ${USERNAME} \
    && usermod -aG sudo ${USERNAME} \
    && echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER ${USERNAME}
WORKDIR ${HOME_DIR_PATH}

ADD context_data /context_data

RUN git clone https://github.com/Meta-Platform/meta-platform-package-executor-command-line.git package-executor \
    && cd package-executor \
    && npm install \
    && sudo npm link

WORKDIR ${HOME_DIR_PATH}
RUN wget https://github.com/Meta-Platform/meta-platform-setup-wizard-command-line/releases/download/0.0.19/meta-platform-setup-wizard-command-line-0.0.19-preview-linux-x64 -O mywizard \
    && chmod +x mywizard

RUN ./mywizard install release-standard

ENV PATH="${HOME_DIR_PATH}/EcosystemData/executables:${PATH}"

RUN repo register source ${REPOSITORY_NAMESPACE} LOCAL_FS --localPath ${REPOSITORY_CONTEXT_PATH}
RUN repo install ${REPOSITORY_NAMESPACE} LOCAL_FS

ENV PACKAGE_PATH=${PACKAGE_PATH}
ENV STARTUP_JSON=${STARTUP_JSON}
ENV ECOSYSTEM_DEFAULT=${ECOSYSTEM_DEFAULT}
ENV ECOSYSTEM_DATA_PATH=${ECOSYSTEM_DATA_PATH}
ENV NODEJS_DEPS_PATH=${NODEJS_DEPS_PATH}

CMD ["sh", "-c", "pkg-exec --package $PACKAGE_PATH --startupJson $STARTUP_JSON --ecosystemDefault $ECOSYSTEM_DEFAULT --ecosystemData $ECOSYSTEM_DATA_PATH --nodejsProjectDependencies $NODEJS_DEPS_PATH --verbose"]