    var fs          = require('fs');
    var jenkins_api = require('jenkins-api');

    var sConfigFile = './.config.json';
    var bReadConfig = false;

    if (fs.existsSync(sConfigFile)) {
        oConfig         = JSON.parse(fs.readFileSync(sConfigFile));
        bReadConfig     = true;
    } else {
        var oConfig     = {
            domain:   null,
            username: null,
            token:    null
        };
    }

    if (process.argv.length > 4) {
        oConfig.domain   = process.argv[2];
        oConfig.username = process.argv[3];
        oConfig.token    = process.argv[4];

        fs.writeFileSync(sConfigFile, JSON.stringify(oConfig));
        console.log('Config File Written')
    } else if (bReadConfig == false) {
        console.log('Usage: jenky [domain] [username] [api-token]');
        console.log('You can get your api-token at https://your-jenkins-url.com/me/configure');
        process.exit(1);
    }

    var sUrl     = 'https://' + oConfig.username + ':' + oConfig.token + '@' + oConfig.domain;
    var oJenkins = jenkins_api.init(sUrl);
    var aQueue   = [];
    var aRunning = [];

    oJenkins.queue(function(oQueueError, oQueueData) {
        oJenkins.computers(function(oComputersError, oComputersData) {
            if (oQueueData
            &&  oQueueData.items
            &&  oQueueData.items.length) {
                for (var i in oQueueData.items) {
                    aQueue.push(oQueueData.items[i].task);
                }
            }

            if (oComputersData
            &&  oComputersData.computer
            &&  oComputersData.computer.length) {
                for (var c in oComputersData.computer) {
                    var oComputer = oComputersData.computer[c];
                    if (oComputer.executors) {
                        for (var e in oComputer.executors) {
                            var oExecutor = oComputer.executors[e];
                            if (oExecutor.idle == false) {
                                var oRunning = oExecutor.currentExecutable;
                                oRunning.progress = oExecutor.progress;

                                // silly - i know, but simple.  improve it if you must
                                var aUrl = oRunning.url.split('/');
                                aUrl.pop();
                                aUrl.pop();
                                oRunning.name = aUrl.pop();
                                aRunning.push(oRunning);
                            }

                        }
                    }
                }
            }

            if (aQueue.length && aRunning.length) {
                for (var q in aQueue) {
                    console.log(['...', aQueue[q].name].join("\t"));  // , aQueue[q].url
                }

                for (var r in aRunning) {
                    console.log([aRunning[r].progress, aRunning[r].name].join("\t"));  // , aRunning[r].url
                }
            } else {
                console.log('Awfully Quiet around here!')
            }
        });
    });


/*
    SAMPLE OUTPUT:

    var Queue = {
        "items": [
            {
                "actions": [
                    {
                        "causes": [
                            {
                                "shortDescription": "Started by upstream project \"auto-cameo-cms\" build number 156",
                                "upstreamBuild": 156,
                                "upstreamProject": "auto-cameo-cms",
                                "upstreamUrl": "job/auto-cameo-cms/"
                            },
                            {
                                "shortDescription": "Started by upstream project \"auto-cameo-cms\" build number 157",
                                "upstreamBuild": 157,
                                "upstreamProject": "auto-cameo-cms",
                                "upstreamUrl": "job/auto-cameo-cms/"
                            }
                        ]
                    }
                ],
                "blocked": false,
                "buildable": true,
                "id": 296,
                "inQueueSince": 1385060118349,
                "params": "",
                "stuck": false,
                "task": {
                    "name": "auto-cameo-cms-deploy",
                    "url": "https://ci.build.inet.cameo.tv/job/auto-cameo-cms-deploy/",
                    "color": "blue"
                },
                "url": "queue/item/296/",
                "why": "Waiting for next available executor on ",
                "buildableStartMilliseconds": 1385060118352,
                "pending": false
            }
        ]
    }


    var Computers = {
        "busyExecutors": 4,
        "computer": [
        {
            "actions": [],
            "displayName": "master",
            "executors": [
                {
                    "currentExecutable": {
                        "number": 165,
                        "url": "https://ci.build.inet.cameo.tv/job/auto-cameo-config-deploy/165/"
                    },
                    "currentWorkUnit": {},
                    "idle": false,
                    "likelyStuck": false,
                    "number": 0,
                    "progress": 61
                }
            ],
            "icon": "computer.png",
            "idle": false,
            "jnlpAgent": false,
            "launchSupported": true,
            "loadStatistics": {
                "busyExecutors": {},
                "queueLength": {},
                "totalExecutors": {}
            },
            "manualLaunchAllowed": true,
            "monitorData": {
                "hudson.node_monitors.SwapSpaceMonitor": {
                    "availablePhysicalMemory": 641445888,
                    "availableSwapSpace": 931254272,
                    "totalPhysicalMemory": 1774850048,
                    "totalSwapSpace": 939520000
                },
                "hudson.node_monitors.ArchitectureMonitor": "Linux (amd64)",
                "hudson.node_monitors.ResponseTimeMonitor": {
                    "average": 0
                },
                "hudson.node_monitors.TemporarySpaceMonitor": {
                    "path": "/tmp",
                    "size": 5925330944
                },
                "hudson.node_monitors.DiskSpaceMonitor": {
                    "path": "/var/lib/jenkins",
                    "size": 5925330944
                },
                "hudson.node_monitors.ClockMonitor": {
                    "diff": 0
                }
            },
            "numExecutors": 1,
            "offline": false,
            "offlineCause": null,
            "offlineCauseReason": "",
            "oneOffExecutors": [],
            "temporarilyOffline": false
        },
        {
            "actions": [],
            "displayName": "jenkinsjason",
            "executors": [
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 0,
                    "progress": -1
                },
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 1,
                    "progress": -1
                },
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 2,
                    "progress": -1
                },
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 3,
                    "progress": -1
                },
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 4,
                    "progress": -1
                },
                {
                    "currentExecutable": {
                        "number": 717,
                        "url": "https://ci.build.inet.cameo.tv/job/auto-cameo-api/717/"
                    },
                    "currentWorkUnit": {},
                    "idle": false,
                    "likelyStuck": false,
                    "number": 5,
                    "progress": 32
                },
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 6,
                    "progress": -1
                },
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 7,
                    "progress": -1
                },
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 8,
                    "progress": -1
                },
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 9,
                    "progress": -1
                },
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 10,
                    "progress": -1
                },
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 11,
                    "progress": -1
                },
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 12,
                    "progress": -1
                },
                {
                    "currentExecutable": {
                        "number": 67,
                        "url": "https://ci.build.inet.cameo.tv/job/auto-cameo-file-daemon/67/"
                    },
                    "currentWorkUnit": {},
                    "idle": false,
                    "likelyStuck": false,
                    "number": 13,
                    "progress": 15
                },
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 14,
                    "progress": -1
                },
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 15,
                    "progress": -1
                },
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 17,
                    "progress": -1
                },
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 16,
                    "progress": -1
                },
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 19,
                    "progress": -1
                },
                {
                    "currentExecutable": {
                        "number": 157,
                        "url": "https://ci.build.inet.cameo.tv/job/auto-cameo-cms/157/"
                    },
                    "currentWorkUnit": {},
                    "idle": false,
                    "likelyStuck": false,
                    "number": 18,
                    "progress": 15
                },
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 21,
                    "progress": -1
                },
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 20,
                    "progress": -1
                },
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 23,
                    "progress": -1
                },
                {
                    "currentExecutable": null,
                    "currentWorkUnit": null,
                    "idle": true,
                    "likelyStuck": false,
                    "number": 22,
                    "progress": -1
                }
            ],
            "icon": "computer.png",
            "idle": false,
            "jnlpAgent": true,
            "launchSupported": false,
            "loadStatistics": {
                "busyExecutors": {},
                "queueLength": {},
                "totalExecutors": {}
            },
            "manualLaunchAllowed": true,
            "monitorData": {
                "hudson.node_monitors.SwapSpaceMonitor": {
                    "availablePhysicalMemory": 5389549568,
                    "availableSwapSpace": 0,
                    "totalPhysicalMemory": 35899650048,
                    "totalSwapSpace": 0
                },
                "hudson.node_monitors.ArchitectureMonitor": "Linux (amd64)",
                "hudson.node_monitors.ResponseTimeMonitor": {
                    "average": 89
                },
                "hudson.node_monitors.TemporarySpaceMonitor": {
                    "path": "/tmp",
                    "size": 7244791808
                },
                "hudson.node_monitors.DiskSpaceMonitor": {
                    "path": "/var/lib/jenkins",
                    "size": 7244791808
                },
                "hudson.node_monitors.ClockMonitor": {
                    "diff": 9
                }
            },
            "numExecutors": 24,
            "offline": false,
            "offlineCause": null,
            "offlineCauseReason": "",
            "oneOffExecutors": [],
            "temporarilyOffline": false
        }
    ],
        "displayName": "nodes",
        "totalExecutors": 25
    }
 */