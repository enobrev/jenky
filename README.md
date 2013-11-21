jenky
=====

Watch Jenkins Jobs From the Command Line

## Usage

It's recommended that your run jenky once with your config settings, so it can cache them to a local config file.

Parameters:

| parameter | description
|-----------|-------------------------------------------------------------------------------------|
| domain    | the domain name of your jenkins install                                             |
| username  | your jenkins username                                                               |
| api-token | your api-token, which can be retrieved at https://your-jenkins-url.com/me/configure |

### First Call

```bash
$ jenky [domain username api-token]
```

### Auto-Updating Formatted Output

This will output results every 5 seconds

```bash
$ watch -n 5 'jenky | column -t'
```