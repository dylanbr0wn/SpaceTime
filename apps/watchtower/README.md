# Watchtower Configuration File

You need to create a file called `watchtower-config.json` in this directory. This file will have the following contents:

```json
{
    "auths": {
        "https://index.docker.io": {
            "auth": "<username:password encoded in base64>"
        }
    }
}
```
