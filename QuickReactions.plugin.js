/**
 * @name QuickReactions
 * @author Jakin687
 * @version 1.2.0
 * @description Plugin that adds a QuickReaction-Button
 * @website https://github.com/Jakin687/BetterDiscordQuickReactions/tree/master
 * @source https://raw.githubusercontent.com/Jakin687/BetterDiscordQuickReactions/master/QuickReactions.plugin.js
 * @updateUrl https://raw.githubusercontent.com/Jakin687/BetterDiscordQuickReactions/master/QuickReactions.plugin.js
 */


 module.exports = (() => {
    const config = {
        info: {
            name: "QuickReactions",
            authors: [{
                    name: "Jakin687",
                    discrod_id: 387607262778359828,
                    github_username: "Jakin687"
                }
            ],
            version: "1.2.0",
            description: "Plugin that adds a QuickReaction-Button",
            github: "https://github.com/Jakin687/BetterDiscordQuickReactions/blob/master/QuickReactions.plugin.js",
            github_raw: "https://raw.githubusercontent.com/Jakin687/BetterDiscordQuickReactions/master/QuickReactions.plugin.js"
        },
        changelog: [
            {
                "title": "Customizable", "items": ["You can now change the side the button appears on!"]
            }
        ],
        main: 'index.js',
    };

    return !globalThis.ZeresPluginLibrary ? class {
        constructor() { this._config = config; }
        getName() { return config.info.name; }
        getAuthor() { return config.info.authors.map(a => a.name).join(', '); }
        getDescription() { return config.info.description; }
        getVersion() { return config.info.version; }
        load() {
            BdApi.showConfirmationModal('Library Missing', `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: 'Download Now',
                cancelText: 'Cancel',
                onConfirm: () => {
                    require('request').get('https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js', async (error, response, body) => {
                        if (error) return require('electron').shell.openExternal('https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js');
                        await new Promise(r => require('fs').writeFile(require('path').join(BdApi.Plugins.folder, '0PluginLibrary.plugin.js'), body, r));
                    });
                }
            });
        }
        start() { }
        stop() { }
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Library) => {

            const
                { DiscordModules, DiscordAPI, PluginUtilities } = Api,
                { Patcher, Settings, Tooltip, ReactComponents } = Library,
                { React, ReactDOM } = BdApi;

            const ButtonClassesModule = BdApi.findModuleByProps('button', 'contents');
            const ButtonContainerClassesModule = BdApi.findModuleByProps('buttonContainer', 'buttons');
            const ButtonWrapperClassesModule = BdApi.findModuleByProps('buttonWrapper', 'buttonContent');
            const TooltipContainer = BdApi.findModuleByProps('TooltipContainer').TooltipContainer;
			const TooltipWrapper = BdApi.findModuleByPrototypes("renderTooltip");
            const EmojiModule = BdApi.findModule(m => m.Emoji && m.default.getByName);

            // Not finished
            const emoji_list = {"100":"💯","1234":"🔢","grinning":"😀","smiley":"😃","smile":"😄","grin":"😁","laughing":"😆","satisfied":"😆","sweat_smile":"😅","joy":"😂","rofl":"🤣","rolling_on_the_floor_laughing":"🤣","relaxed":"☺️","blush":"😊","innocent":"😇","slight_smile":"🙂","slightly_smiling_face":"🙂","upside_down":"🙃","upside_down_face":"🙃","wink":"😉","relieved":"😌","smiling_face_with_tear":"🥲","heart_eyes":"😍","smiling_face_with_3_hearts":"🥰","kissing_heart":"😘","kissing":"😗","kissing_smiling_eyes":"😙","kissing_closed_eyes":"😚","yum":"😋","stuck_out_tongue":"😛","stuck_out_tongue_closed_eyes":"😝","stuck_out_tongue_winking_eye":"😜","zany_face":"🤪","face_with_raised_eyebrow":"🤨","face_with_monocle":"🧐","nerd":"🤓","nerd_face":"🤓","sunglasses":"😎","star_struck":"🤩","partying_face":"🥳","smirk":"😏","unamused":"😒","disappointed":"😞","pensive":"😔","worried":"😟","confused":"😕","slight_frown":"🙁","slightly_frowning_face":"🙁","frowning2":"☹️","white_frowning_face":"☹️","persevere":"😣","confounded":"😖","tired_face":"😫","weary":"😩","pleading_face":"🥺","cry":"😢","sob":"😭","triumph":"😤","face_exhaling":"😮‍💨","angry":"😠","rage":"😡","face_with_symbols_over_mouth":"🤬","exploding_head":"🤯","flushed":"😳","face_in_clouds":"😶‍🌫️","hot_face":"🥵","cold_face":"🥶","scream":"😱","fearful":"😨","cold_sweat":"😰","disappointed_relieved":"😥","sweat":"😓","hugging":"🤗","hugging_face":"🤗","thinking":"🤔","thinking_face":"🤔","face_with_hand_over_mouth":"🤭","yawning_face":"🥱","shushing_face":"🤫","lying_face":"🤥","liar":"🤥","no_mouth":"😶","neutral_face":"😐","expressionless":"😑","grimacing":"😬","rolling_eyes":"🙄","face_with_rolling_eyes":"🙄","hushed":"😯","frowning":"😦","anguished":"😧","open_mouth":"😮","astonished":"😲","sleeping":"😴","drooling_face":"🤤","drool":"🤤","sleepy":"😪","dizzy_face":"😵","face_with_spiral_eyes":"😵‍💫","zipper_mouth":"🤐","zipper_mouth_face":"🤐","woozy_face":"🥴","nauseated_face":"🤢","sick":"🤢","face_vomiting":"🤮","sneezing_face":"🤧","sneeze":"🤧","mask":"😷","thermometer_face":"🤒","face_with_thermometer":"🤒","head_bandage":"🤕","face_with_head_bandage":"🤕","money_mouth":"🤑","money_mouth_face":"🤑","cowboy":"🤠","face_with_cowboy_hat":"🤠","disguised_face":"🥸","smiling_imp":"😈","imp":"👿","japanese_ogre":"👹","japanese_goblin":"👺","clown":"🤡","clown_face":"🤡","poop":"💩","shit":"💩","hankey":"💩","poo":"💩","ghost":"👻","skull":"💀","skeleton":"💀","skull_crossbones":"☠️","skull_and_crossbones":"☠️","alien":"👽","space_invader":"👾","robot":"🤖","robot_face":"🤖","jack_o_lantern":"🎃","smiley_cat":"😺","smile_cat":"😸","joy_cat":"😹","heart_eyes_cat":"😻","smirk_cat":"😼","kissing_cat":"😽","scream_cat":"🙀","crying_cat_face":"😿","pouting_cat":"😾","palms_up_together":"🤲","palms_up_together_tone1":"🤲🏻","palms_up_together_light_skin_tone":"🤲🏻","palms_up_together_tone2":"🤲🏼","palms_up_together_medium_light_skin_tone":"🤲🏼","palms_up_together_tone3":"🤲🏽","palms_up_together_medium_skin_tone":"🤲🏽","palms_up_together_tone4":"🤲🏾","palms_up_together_medium_dark_skin_tone":"🤲🏾","palms_up_together_tone5":"🤲🏿","palms_up_together_dark_skin_tone":"🤲🏿","open_hands":"👐","open_hands_tone1":"👐🏻","open_hands_tone2":"👐🏼","open_hands_tone3":"👐🏽","open_hands_tone4":"👐🏾","open_hands_tone5":"👐🏿","raised_hands":"🙌","raised_hands_tone1":"🙌🏻","raised_hands_tone2":"🙌🏼","raised_hands_tone3":"🙌🏽","raised_hands_tone4":"🙌🏾","raised_hands_tone5":"🙌🏿","clap":"👏","clap_tone1":"👏🏻","clap_tone2":"👏🏼","clap_tone3":"👏🏽","clap_tone4":"👏🏾","clap_tone5":"👏🏿","handshake":"🤝","shaking_hands":"🤝","thumbsup":"👍","+1":"👍","thumbup":"👍","thumbsup_tone1":"👍🏻","+1_tone1":"👍🏻","thumbup_tone1":"👍🏻","thumbsup_tone2":"👍🏼","+1_tone2":"👍🏼","thumbup_tone2":"👍🏼","thumbsup_tone3":"👍🏽","+1_tone3":"👍🏽","thumbup_tone3":"👍🏽","thumbsup_tone4":"👍🏾","+1_tone4":"👍🏾","thumbup_tone4":"👍🏾","thumbsup_tone5":"👍🏿","+1_tone5":"👍🏿","thumbup_tone5":"👍🏿","thumbsdown":"👎","-1":"👎","thumbdown":"👎","thumbsdown_tone1":"👎🏻","_1_tone1":"👎🏻","thumbdown_tone1":"👎🏻","thumbsdown_tone2":"👎🏼","_1_tone2":"👎🏼","thumbdown_tone2":"👎🏼","thumbsdown_tone3":"👎🏽","_1_tone3":"👎🏽","thumbdown_tone3":"👎🏽","thumbsdown_tone4":"👎🏾","_1_tone4":"👎🏾","thumbdown_tone4":"👎🏾","thumbsdown_tone5":"👎🏿","_1_tone5":"👎🏿","thumbdown_tone5":"👎🏿","punch":"👊","punch_tone1":"👊🏻","punch_tone2":"👊🏼","punch_tone3":"👊🏽","punch_tone4":"👊🏾","punch_tone5":"👊🏿","fist":"✊","fist_tone1":"✊🏻","fist_tone2":"✊🏼","fist_tone3":"✊🏽","fist_tone4":"✊🏾","fist_tone5":"✊🏿","left_facing_fist":"🤛","left_fist":"🤛","left_facing_fist_tone1":"🤛🏻","left_fist_tone1":"🤛🏻","left_facing_fist_tone2":"🤛🏼","left_fist_tone2":"🤛🏼","left_facing_fist_tone3":"🤛🏽","left_fist_tone3":"🤛🏽","left_facing_fist_tone4":"🤛🏾","left_fist_tone4":"🤛🏾","left_facing_fist_tone5":"🤛🏿","left_fist_tone5":"🤛🏿","right_facing_fist":"🤜","right_fist":"🤜","right_facing_fist_tone1":"🤜🏻","right_fist_tone1":"🤜🏻","right_facing_fist_tone2":"🤜🏼","right_fist_tone2":"🤜🏼","right_facing_fist_tone3":"🤜🏽","right_fist_tone3":"🤜🏽","right_facing_fist_tone4":"🤜🏾","right_fist_tone4":"🤜🏾","right_facing_fist_tone5":"🤜🏿","right_fist_tone5":"🤜🏿","fingers_crossed":"🤞","hand_with_index_and_middle_finger_crossed":"🤞","fingers_crossed_tone1":"🤞🏻","hand_with_index_and_middle_fingers_crossed_tone1":"🤞🏻","fingers_crossed_tone2":"🤞🏼","hand_with_index_and_middle_fingers_crossed_tone2":"🤞🏼","fingers_crossed_tone3":"🤞🏽","hand_with_index_and_middle_fingers_crossed_tone3":"🤞🏽","fingers_crossed_tone4":"🤞🏾","hand_with_index_and_middle_fingers_crossed_tone4":"🤞🏾","fingers_crossed_tone5":"🤞🏿","hand_with_index_and_middle_fingers_crossed_tone5":"🤞🏿","v":"✌️","v_tone1":"✌🏻","v_tone2":"✌🏼","v_tone3":"✌🏽","v_tone4":"✌🏾","v_tone5":"✌🏿","love_you_gesture":"🤟","love_you_gesture_tone1":"🤟🏻","love_you_gesture_light_skin_tone":"🤟🏻","love_you_gesture_tone2":"🤟🏼","love_you_gesture_medium_light_skin_tone":"🤟🏼","love_you_gesture_tone3":"🤟🏽","love_you_gesture_medium_skin_tone":"🤟🏽","love_you_gesture_tone4":"🤟🏾","love_you_gesture_medium_dark_skin_tone":"🤟🏾","love_you_gesture_tone5":"🤟🏿","love_you_gesture_dark_skin_tone":"🤟🏿","metal":"🤘","sign_of_the_horns":"🤘","metal_tone1":"🤘🏻","sign_of_the_horns_tone1":"🤘🏻","metal_tone2":"🤘🏼","sign_of_the_horns_tone2":"🤘🏼","metal_tone3":"🤘🏽","sign_of_the_horns_tone3":"🤘🏽","metal_tone4":"🤘🏾","sign_of_the_horns_tone4":"🤘🏾","metal_tone5":"🤘🏿","sign_of_the_horns_tone5":"🤘🏿","ok_hand":"👌","ok_hand_tone1":"👌🏻","ok_hand_tone2":"👌🏼","ok_hand_tone3":"👌🏽","ok_hand_tone4":"👌🏾","ok_hand_tone5":"👌🏿","pinching_hand":"🤏","pinching_hand_tone1":"🤏🏻","pinching_hand_light_skin_tone":"🤏🏻","pinching_hand_tone2":"🤏🏼","pinching_hand_medium_light_skin_tone":"🤏🏼","pinching_hand_tone3":"🤏🏽","pinching_hand_medium_skin_tone":"🤏🏽","pinching_hand_tone4":"🤏🏾","pinching_hand_medium_dark_skin_tone":"🤏🏾","pinching_hand_tone5":"🤏🏿","pinching_hand_dark_skin_tone":"🤏🏿","pinched_fingers":"🤌","pinched_fingers_tone2":"🤌🏼","pinched_fingers_medium_light_skin_tone":"🤌🏼","pinched_fingers_tone1":"🤌🏻","pinched_fingers_light_skin_tone":"🤌🏻","pinched_fingers_tone3":"🤌🏽","pinched_fingers_medium_skin_tone":"🤌🏽","pinched_fingers_tone4":"🤌🏾","pinched_fingers_medium_dark_skin_tone":"🤌🏾","pinched_fingers_tone5":"🤌🏿","pinched_fingers_dark_skin_tone":"🤌🏿","point_left":"👈","point_left_tone1":"👈🏻","point_left_tone2":"👈🏼","point_left_tone3":"👈🏽","point_left_tone4":"👈🏾","point_left_tone5":"👈🏿","point_right":"👉","point_right_tone1":"👉🏻","point_right_tone2":"👉🏼","point_right_tone3":"👉🏽","point_right_tone4":"👉🏾","point_right_tone5":"👉🏿","point_up_2":"👆","point_up_2_tone1":"👆🏻","point_up_2_tone2":"👆🏼","point_up_2_tone3":"👆🏽","point_up_2_tone4":"👆🏾","point_up_2_tone5":"👆🏿","point_down":"👇","point_down_tone1":"👇🏻","point_down_tone2":"👇🏼","point_down_tone3":"👇🏽","point_down_tone4":"👇🏾","point_down_tone5":"👇🏿","point_up":"☝️","point_up_tone1":"☝🏻","point_up_tone2":"☝🏼","point_up_tone3":"☝🏽","point_up_tone4":"☝🏾","point_up_tone5":"☝🏿","raised_hand":"✋","raised_hand_tone1":"✋🏻","raised_hand_tone2":"✋🏼","raised_hand_tone3":"✋🏽","raised_hand_tone4":"✋🏾","raised_hand_tone5":"✋🏿","raised_back_of_hand":"🤚","back_of_hand":"🤚","raised_back_of_hand_tone1":"🤚🏻","back_of_hand_tone1":"🤚🏻","raised_back_of_hand_tone2":"🤚🏼","back_of_hand_tone2":"🤚🏼","raised_back_of_hand_tone3":"🤚🏽","back_of_hand_tone3":"🤚🏽","raised_back_of_hand_tone4":"🤚🏾","back_of_hand_tone4":"🤚🏾","raised_back_of_hand_tone5":"🤚🏿","back_of_hand_tone5":"🤚🏿","hand_splayed":"🖐️","raised_hand_with_fingers_splayed":"🖐️","hand_splayed_tone1":"🖐🏻","raised_hand_with_fingers_splayed_tone1":"🖐🏻","hand_splayed_tone2":"🖐🏼","raised_hand_with_fingers_splayed_tone2":"🖐🏼","hand_splayed_tone3":"🖐🏽","raised_hand_with_fingers_splayed_tone3":"🖐🏽","hand_splayed_tone4":"🖐🏾","raised_hand_with_fingers_splayed_tone4":"🖐🏾","hand_splayed_tone5":"🖐🏿","raised_hand_with_fingers_splayed_tone5":"🖐🏿","vulcan":"🖖","raised_hand_with_part_between_middle_and_ring_fingers":"🖖","vulcan_tone1":"🖖🏻","raised_hand_with_part_between_middle_and_ring_fingers_tone1":"🖖🏻","vulcan_tone2":"🖖🏼","raised_hand_with_part_between_middle_and_ring_fingers_tone2":"🖖🏼","vulcan_tone3":"🖖🏽","raised_hand_with_part_between_middle_and_ring_fingers_tone3":"🖖🏽","vulcan_tone4":"🖖🏾","raised_hand_with_part_between_middle_and_ring_fingers_tone4":"🖖🏾","vulcan_tone5":"🖖🏿","raised_hand_with_part_between_middle_and_ring_fingers_tone5":"🖖🏿","wave":"👋","wave_tone1":"👋🏻","wave_tone2":"👋🏼","wave_tone3":"👋🏽","wave_tone4":"👋🏾","wave_tone5":"👋🏿","call_me":"🤙","call_me_hand":"🤙","call_me_tone1":"🤙🏻","call_me_hand_tone1":"🤙🏻","call_me_tone2":"🤙🏼","call_me_hand_tone2":"🤙🏼",
                        "call_me_tone3":"🤙🏽","call_me_hand_tone3":"🤙🏽","call_me_tone4":"🤙🏾","call_me_hand_tone4":"🤙🏾","call_me_tone5":"🤙🏿","call_me_hand_tone5":"🤙🏿","muscle":"💪","muscle_tone1":"💪🏻","muscle_tone2":"💪🏼","muscle_tone3":"💪🏽","muscle_tone4":"💪🏾","muscle_tone5":"💪🏿","mechanical_arm":"🦾","middle_finger":"🖕","reversed_hand_with_middle_finger_extended":"🖕","middle_finger_tone1":"🖕🏻","reversed_hand_with_middle_finger_extended_tone1":"🖕🏻","middle_finger_tone2":"🖕🏼","reversed_hand_with_middle_finger_extended_tone2":"🖕🏼","middle_finger_tone3":"🖕🏽","reversed_hand_with_middle_finger_extended_tone3":"🖕🏽","middle_finger_tone4":"🖕🏾","reversed_hand_with_middle_finger_extended_tone4":"🖕🏾","middle_finger_tone5":"🖕🏿","reversed_hand_with_middle_finger_extended_tone5":"🖕🏿","writing_hand":"✍️","writing_hand_tone1":"✍🏻","writing_hand_tone2":"✍🏼","writing_hand_tone3":"✍🏽","writing_hand_tone4":"✍🏾","writing_hand_tone5":"✍🏿","pray":"🙏","pray_tone1":"🙏🏻","pray_tone2":"🙏🏼","pray_tone3":"🙏🏽","pray_tone4":"🙏🏾","pray_tone5":"🙏🏿"};
            const { SettingPanel, SettingGroup, RadioGroup, Switch, Textbox } = Settings;

            return class FirstTest extends Plugin {
                constructor() {
                    super();

                    this.defaultSettings = {
                        emoji: "👍",
                        side: "right"
                    }

                    this.settings = PluginUtilities.loadSettings(this.getName());

                    if (this.settings.emoji == undefined) {
                        this.settings.emoji = this.defaultSettings.emoji;
                    }

                    if (this.settings.side == undefined) {
                        this.settings.side = this.defaultSettings.side;
                    }

                    PluginUtilities.saveSettings(this.getName(), this.settings);
                }

                toast(line) {
                    BdApi.showToast(line);
                }

                getName() { return config.info.name; }
                getAuthor() { return config.info.authors.map(a => a.name).join(", "); }
                getDescription() { return config.info.description; }
                getVersion() { return config.info.version; }

                addReaction(channelId, messageId, emoji) {
                    BDFDB.LibraryModules.ReactionUtils.addReaction(
                        channelId,
                        messageId, {
                            id: null,
                            name: emoji
                        }
                    );
                }

                inject_button() {
                    if (document.querySelector(".buttons-uaqb-5") == undefined) {
                        return;
                    }
                    if (document.querySelector(".quickReactionButtonContainer-out") != undefined) {
                        return;
                    }
                    const QuickReactionButton = BdApi.React.createElement(
                        TooltipContainer, {
                            key: "QuickReactionButton",
                            text: this.settings.emoji,
                            className: `quickReactionButtonContainer ${ButtonContainerClassesModule.buttonContainer} reactionButton`
                        },
                            BdApi.React.createElement("button", {
                                "aria-label": "Add Reaction",
                                tabindex: 0,
                                type: "button",
                                className: `quickReactionButtonContainer ${ButtonWrapperClassesModule.buttonWrapper} ${ButtonClassesModule.button} ${ButtonClassesModule.lookBlank} ${ButtonClassesModule.colorBrand} ${ButtonClassesModule.grow}`,
                                onClick: ((e) => {
                                    // Public Channels : .selected-2TbFuo
                                    // Private Channels: .selected-3veCBZ

                                    let channel_id = null;
                                    let message_id = null;

                                    try {
                                        channel_id = document.querySelector(".selected-2TbFuo").firstChild.firstChild.firstChild.getAttribute("data-list-item-id").substring(11);
                                        message_id = document.querySelector(".messagesWrapper-RpOMA3").firstChild.firstChild.firstChild.lastChild.previousSibling.id.substring(14);
                                    }catch(err) {
                                        try {
                                            channel_id = document.querySelector(".selected-3veCBZ").firstChild.getAttribute("data-list-item-id");// 27
                                            channel_id = channel_id.substring(channel_id.lastIndexOf("_")+1);
                                            message_id = document.querySelector(".messagesWrapper-RpOMA3").firstChild.firstChild.firstChild.lastChild.previousSibling.id.substring(14);
                                        }catch(err2) {
                                            this.toast("Something went wrong!");
                                            this.toast(err2);
                                            return;
                                        }
                                    }
                                    this.addReaction(channel_id, message_id, this.settings.emoji);
                                    this.toast(this.settings.emoji);
                                })
                            },
                                BdApi.React.createElement("div", { className: `quickReactionButtonContainer ${ButtonClassesModule.contents} ${ButtonWrapperClassesModule.button} ${ButtonContainerClassesModule.button}` },
                                    BdApi.React.createElement("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: `quickReactionButton ${ButtonWrapperClassesModule.icon}` }, [
                                        BdApi.React.createElement("path", { d: "M21 3V0H19V3H16V5H19V8H21V5H24V3H21Z", fill: "currentColor" }),
                                        BdApi.React.createElement("path", { d: "M12.2512 2.00309C12.1677 2.00104 12.084 2 12 2C6.477 2 2 6.477 2 12C2 17.522 6.477 22 12 22C17.523 22 22 17.522 22 12C22 11.916 21.999 11.8323 21.9969 11.7488C21.3586 11.9128 20.6895 12 20 12C15.5817 12 12 8.41828 12 4C12 3.31052 12.0872 2.6414 12.2512 2.00309ZM10 8C10 6.896 9.104 6 8 6C6.896 6 6 6.896 6 8C6 9.105 6.896 10 8 10C9.104 10 10 9.105 10 8ZM12 19C15.14 19 18 16.617 18 14V13H6V14C6 16.617 8.86 19 12 19Z", fill: "currentColor" })
                                    ])
							    )
                            )
                    );

                    let container = document.createElement("div");
                    container.classList = "quickReactionButtonContainer-out";

                    if (this.settings.side == "right") {
                        container.style.height = "100%";
                        container.style.display = "flex";
                        container.style.flexDirection = "row";
                        container.style.justifyContent = "center";
                        container.style.alignItems = "center";
                        container.style.padding = "";
                        document.querySelector(".buttons-uaqb-5").prepend(container);
                    }else {
                        let prev = document.getElementsByClassName("attachButton-_ACFSu attachButton-1ijpt9 button-f2h6uQ lookBlank-21BCro colorBrand-I6CyqQ grow-2sR_-F")[0];
                        prev.style.padding = "0";
                        prev.style.margin = "0 0 0 0";
                        container.style.padding = "6px 0";
                        document.querySelector(".attachWrapper-3slhXI").after(container);
                    }

                    ReactDOM.render(QuickReactionButton, document.querySelector(".quickReactionButtonContainer-out"));
                }

                remove_button() {
                    document.querySelector(".quickReactionButtonContainer-out").remove();
                }

                getSettingsPanel() {
                    let settings_div = document.createElement("div");
                    let settings_title = document.createElement("label");
                    settings_title.classList = "title-2dsDLn";
                    settings_title.textContent = "Choose emoji:";

                    settings_div.appendChild(settings_title);

                    settings_div.innerHTML += `
                        <div class="input-group">
                            <input type="text" class="inputDefault-3FGxgL input-2g-os5 form-control" id="emoji" placeholder=":thumbsup:" title="Choose emoji">
                        </div>
                        `
                    ;

                    let settings_input = settings_div.querySelector("input");
                    settings_input.value = this.settings.emoji;
                    settings_input.addEventListener("change", (e) => {
                        e.target.value = e.target.value.replaceAll(":", "");
                        if (emoji_list[e.target.value] == undefined) {
                            this.toast("What?");
                            return;
                        }
                        this.settings.emoji = emoji_list[e.target.value];
                        PluginUtilities.saveSettings(this.getName(), this.settings);
                        this.toast("Icon changed to: " + this.settings.emoji);
                    });

                    let side_options = [
                        {
                            name: 'Right',
                            desc: 'The button will appear on the right.',
                            value: "right"
                        },
                        {
                            name: 'Left',
                            desc: 'The button will appear on the left.',
                            value: "left"
                        }
                    ];

                    return Settings.SettingPanel.build(() => this.saveSettings(this.getName(), this.settings),
                        settings_div,
                        new RadioGroup('Side', `Choose the side you want the button to appear on.`, this.settings.side || 0, side_options, (i) => {
                            this.settings.side = i;
                            this.remove_button();
                            this.inject_button();
                        }),

                    );
                }

                start() {
                    this.toast("Icon is: " + this.settings.emoji);
                }
                stop() {  }

                load() {
                    this.inject_button();
                }

                onSwitch() {
                    this.inject_button();
                }
            }
        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
