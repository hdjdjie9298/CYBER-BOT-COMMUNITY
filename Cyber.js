                                    let check = false;
                                    let isError;
                                    logger.loader(global.getText('Cyber', 'notFoundPackage', dependency, event.config.name), 'warn');
                                    execSync('npm --package-lock false --save install' + dependency + (event.config.dependencies[dependency] == '*' || event.config.dependencies[dependency] == '' ? '' : '@' + event.config.dependencies[dependency]), { 'stdio': 'inherit', 'env': process['env'], 'shell': true, 'cwd': join(__dirname, 'nodemodules') });
                                    for (let i = 1; i <= 3; i++) {
                                        try {
                                            require['cache'] = {};
                                            if (global.nodemodule.includes(dependency)) break;
                                            if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) global.nodemodule[dependency] = require(dependency);
                                            else global.nodemodule[dependency] = require(_0x21abed);
                                            check = true;
                                            break;
                                        } catch (error) { isError = error; }
                                        if (check || !isError) break;
                                    }
                                    if (!check || isError) throw global.getText('Cyber', 'cantInstallPackage', dependency, event.config.name);
                                }
                            }
                            logger.loader(global.getText('Cyber', 'loadedPackage', event.config.name));
                        }
                        if (event.config.envConfig) try {
                            for (const _0x5beea0 in event.config.envConfig) {
                                if (typeof global.configModule[event.config.name] == 'undefined') global.configModule[event.config.name] = {};
                                if (typeof global.config[event.config.name] == 'undefined') global.config[event.config.name] = {};
                                if (typeof global.config[event.config.name][_0x5beea0] !== 'undefined') global.configModule[event.config.name][_0x5beea0] = global.config[event.config.name][_0x5beea0];
                                else global.configModule[event.config.name][_0x5beea0] = event.config.envConfig[_0x5beea0] || '';
                                if (typeof global.config[event.config.name][_0x5beea0] == 'undefined') global.config[event.config.name][_0x5beea0] = event.config.envConfig[_0x5beea0] || '';
                            }
                            logger.loader(global.getText('Cyber', 'loadedConfig', event.config.name));
                        } catch (error) {
                            throw new Error(global.getText('Cyber', 'loadedConfig', event.config.name, JSON.stringify(error)));
                        }
                        if (event.onLoad) try {
                            const eventData = {};
                            eventData.api = loginApiData, eventData.models = botModel;
                            event.onLoad(eventData);
                        } catch (error) {
                            throw new Error(global.getText('Cyber', 'cantOnload', event.config.name, JSON.stringify(error)), 'error');
                        }
                        global.client.events.set(event.config.name, event);
                        logger.loader(global.getText('Cyber', 'successLoadModule', event.config.name));
                    } catch (error) {
                        logger.loader(global.getText('Cyber', 'failLoadModule', event.config.name, error), 'error');
                    }
                }
            }(); 
        listenerData.models = botModel;
        const listener = require('./includes/listen')(listenerData);

        function listenerCallback(error, message) {
            if (error) return logger(global.getText('Cyber', 'handleListenError', JSON.stringify(error)), 'error');
            if (['presence', 'typ', 'read_receipt'].some(data => data == message.type)) return;
            if (global.config.DeveloperMode == !![]) console.log(message);
            return listener(message);
        };
        global.handleListen = loginApiData.listenMqtt(listenerCallback);
        try {
            await checkBan(loginApiData);
        } catch (error) {
            return //process.exit(0);
        };
        if (!global.checkBan) logger(global.getText('Cyber', 'warningSourceCode'), '[ GLOBAL BAN ]');
    });
}

//========= Connecting to Database =========//

(async () => {
    try {
        await sequelize.authenticate();
        
