FROM vitalets/tizen-webos-sdk

EXPOSE 4794

COPY entrypoint.sh profile.xml ./
RUN mkdir oauth-host
COPY oauth-host/* ./oauth-host

# jq for quickly parsing the TV name from the API endpoint
RUN apt update && apt install jq nodejs npm -y && rm -rf /var/lib/apt/lists/* && rm -rf /var/cache/apt/*
RUN chown developer:developer entrypoint.sh
RUN chmod +x entrypoint.sh

ENTRYPOINT [ "/home/developer/entrypoint.sh" ]