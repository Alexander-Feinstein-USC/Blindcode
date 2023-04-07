if (typeof window["BLINDCODECONSTANTS"] == "undefined") {

    window["BLINDCODECONSTANTS"] = {
        EASY: "Easy",
        MEDIUM: "Medium",
        HARD: "Hard",
        HIDDEN: "Hidden",

        CHANGE_NOTHING: "0",
        CHANGE_TEXT: "1",
        CHANGE_BACKGROUND: "2",
        CHANGE_TEXT_AND_BACKGROUND: "3",

        CHANGED_ATTR: "BlindcodeColorSaver",
        TEXT_CONTENT_ATTR: "BlindcodeTextContent",
        CLASS_TAG_ADDITION: "BlindcodeClassMarker",

        LOCAL_STORAGE_KEY: "BlindcodeHideDiffulty",

        SWITCH_ON_COLOR: "rgb(0, 175, 155, 0.9)",
        SWITCH_OFF_COLOR: "rgb(255, 255, 255, 0.9)",

        CHANGE_THRESHOLD: 10,

        HIDDEN_TEXT_COLOR: "rgb(51, 122, 183)",
        HIDDEN_BACKGROUND_COLOR: "rgba(51, 122, 183,0.15)"

    }

    window["Blindcode"] = {
        DIFF_COLORS: {
            [window["BLINDCODECONSTANTS"].EASY]: {"rgb(0, 175, 155)": true, "rgb(67, 160, 71)": true, "rgb(92, 184, 92)": true, "rgb(67, 160, 71)": true, "rgb(0, 184, 163)": true},
            [window["BLINDCODECONSTANTS"].MEDIUM]: {"rgb(255, 184, 0)": true, "rgb(239, 108, 0)": true, "rgb(240, 173, 78)": true, "rgb(255, 152, 0)": true, "rgb(255, 192, 30)": true, "rgb(251, 140, 0)": true},
            [window["BLINDCODECONSTANTS"].HARD]: {"rgb(255, 45, 85)": true, "rgb(233, 30, 99)": true, "rgb(217, 83, 79)": true, "rgb(233, 30, 99)": true, "rgb(255, 55, 95)": true},
        },

        stayHiddenIntervals: [],
        repeatedlyHideInterval: null,
        clickHideEventListener: null,

        init: function() {
            var wrapperElem = document.createElement("div");
            wrapperElem.style.height = "52px"
            wrapperElem.style.width = "255px";
            wrapperElem.style.position = "fixed";
            wrapperElem.style.bottom = "-2px";
            wrapperElem.style.left = "-2px";
            wrapperElem.style.border = "2px solid #ddd";
            wrapperElem.style.backgroundColor = "white";
            wrapperElem.style.zIndex = "999999999";
            wrapperElem.style["-webkit-user-select"] = "none";


            var labelElem = document.createElement("span");
            labelElem.style.position = "absolute";
            labelElem.style.top = "50%";
            labelElem.style.transform = "translateY(-50%)";
            labelElem.style.left = "10px";
            labelElem.style.fontFamily = "Arial";
            labelElem.style.fontSize = "14px"
            labelElem.style.fontColor = "black";
            labelElem.style.fontWeight = "bold";
            labelElem.textContent = "Hide Leetcode Difficulty";

            var hideShowButton = document.createElement("div");
            hideShowButton.style.position = "absolute";
            hideShowButton.style.top = "50%";
            hideShowButton.style.transform = "translateY(-50%)";
            hideShowButton.style.right = "5px";
            hideShowButton.style.height = "15px";
            hideShowButton.style.width = "15px";
            hideShowButton.style.borderRadius = "15px";
            hideShowButton.style.overflow = "hidden";
            hideShowButton.style.backgroundColor = "rgb(255, 45, 85)";
            hideShowButton.style.border = "2px solid #ddd";
            hideShowButton.style.cursor = "pointer";

            var hideShowSpan = document.createElement("span");
            hideShowSpan.style.position = "absolute";
            hideShowSpan.style.top = "calc(50% - 1px)";
            hideShowSpan.style.left = "50%";
            hideShowSpan.style.transform = "translate(-50%, -50%)";
            hideShowSpan.style.fontSize = "12px";
            hideShowSpan.style.fontColor = "black";
            hideShowSpan.style.fontWeight = "bold";
            hideShowSpan.textContent = "x";

            let switchOuter = document.createElement("div");
            switchOuter.style.height = "15px";
            switchOuter.style.width = "40px";
            switchOuter.style.border = "1px solid #ddd";
            switchOuter.style.borderRadius = "15px";
            switchOuter.style.position = "absolute";
            switchOuter.style.right = "30px";
            switchOuter.style.top = "50%";
            switchOuter.style.transform = "translateY(-50%)";
            switchOuter.style.cursor = "pointer";

            let switchInner = document.createElement("div");
            switchInner.style.height = "13px";
            switchInner.style.width = "13px";
            switchInner.style.borderRadius = "13px";
            switchInner.style.backgroundColor = "rgb(51, 122, 183)";
            switchInner.style.position = "absolute";
            switchInner.style.top = "50%";
            switchInner.style.transform = "translateY(-50%)";
            switchInner.style.left = "0";

            var isShowingPrompt = true;
            hideShowButton.addEventListener("click", () => {
                if (isShowingPrompt) {
                    wrapperElem.style.left = "-229px";
                    wrapperElem.style.width = "256px";
                    hideShowButton.style.backgroundColor = "rgb(0, 175, 155)";
                    hideShowSpan.textContent = "+";
                } else {
                    wrapperElem.style.left = "0";
                    wrapperElem.style.width = "255px";
                    hideShowButton.style.backgroundColor = "rgb(255, 45, 85)";
                    hideShowSpan.textContent = "x";
                }
                isShowingPrompt = !isShowingPrompt;
            });

            let switchOn = () => {
                switchInner.style.left = "initial";
                switchInner.style.right = "0";
                switchOuter.style.backgroundColor = window["BLINDCODECONSTANTS"].SWITCH_ON_COLOR;

                this.takeAction(true);
            }

            let switchOff = (startUp) => {
                switchInner.style.left = "0";
                switchInner.style.right = "initial";
                switchOuter.style.backgroundColor = window["BLINDCODECONSTANTS"].SWITCH_OFF_COLOR;

                if (!startUp) this.takeAction(false);
            }

            switchOuter.addEventListener("click", () => {
                if (!!window.localStorage.getItem(window["BLINDCODECONSTANTS"].LOCAL_STORAGE_KEY)) switchOff(false);
                else switchOn();
            });

            if (!!window.localStorage.getItem(window["BLINDCODECONSTANTS"].LOCAL_STORAGE_KEY)) switchOn();
            else switchOff(true);

            hideShowButton.appendChild(hideShowSpan);
            switchOuter.appendChild(switchInner);
            wrapperElem.appendChild(labelElem)
            wrapperElem.appendChild(switchOuter)
            wrapperElem.appendChild(hideShowButton);
            document.body.appendChild(wrapperElem);
        },

        takeAction: function(hideDifficulty) {
            if (hideDifficulty) {
                this.hideDifficulty();
                window.localStorage.setItem(window["BLINDCODECONSTANTS"].LOCAL_STORAGE_KEY, "1");
            } else {
                this.showDifficulty();
                window.localStorage.removeItem(window["BLINDCODECONSTANTS"].LOCAL_STORAGE_KEY);
            }
        },

        isDifficulty: function(difficulty, color, background, textContent) {
            if (textContent.toLowerCase() != difficulty.toLowerCase()) return window["BLINDCODECONSTANTS"].CHANGE_NOTHING; 
            else if (!!this.DIFF_COLORS[difficulty][this.convertColorToRGB(color)] && !!this.DIFF_COLORS[difficulty][this.convertColorToRGB(background)]) return window["BLINDCODECONSTANTS"].CHANGE_TEXT_AND_BACKGROUND;
            else if (!!this.DIFF_COLORS[difficulty][this.convertColorToRGB(color)]) return window["BLINDCODECONSTANTS"].CHANGE_TEXT;
            else if (!!this.DIFF_COLORS[difficulty][this.convertColorToRGB(background)]) return window["BLINDCODECONSTANTS"].CHANGE_BACKGROUND;
            else return window["BLINDCODECONSTANTS"].CHANGE_NOTHING;
        },

        hideDifficulty: function() {
            let countTotalElements = 0;
            let newTotalElements = 0;
            let countTaggedElements = 0;
            let newTaggedElements = 0;
            let hideElementsFunc = () => {
                this.forAllHTMLElements(elem => {
                    if (elem.hasAttribute(window["BLINDCODECONSTANTS"].CHANGED_ATTR)) return;
                    var compStyle = getComputedStyle(elem);
                    this.hideDifficultyHelper(elem, this.isDifficulty(window["BLINDCODECONSTANTS"].EASY, compStyle.color, compStyle.backgroundColor, elem.textContent));
                    this.hideDifficultyHelper(elem, this.isDifficulty(window["BLINDCODECONSTANTS"].MEDIUM, compStyle.color, compStyle.backgroundColor, elem.textContent));
                    this.hideDifficultyHelper(elem, this.isDifficulty(window["BLINDCODECONSTANTS"].HARD, compStyle.color, compStyle.backgroundColor, elem.textContent));
                });
            };
            this.clickHideEventListener = () => {
                countTotalElements = 0;
            };
            document.body.addEventListener("click", this.clickHideEventListener);
            this.repeatedlyHideInterval = setInterval(() => {
                newTotalElements = document.getElementsByTagName('*').length;
                newTaggedElements = document.getElementsByClassName(window["BLINDCODECONSTANTS"].CLASS_TAG_ADDITION).length;
                if (Math.abs(newTotalElements - countTotalElements) >= window["BLINDCODECONSTANTS"].CHANGE_THRESHOLD || countTaggedElements != newTaggedElements) {
                    hideElementsFunc();
                    newTotalElements = document.getElementsByTagName('*').length;
                    newTaggedElements = document.getElementsByClassName(window["BLINDCODECONSTANTS"].CLASS_TAG_ADDITION).length;
                }

                countTotalElements = newTotalElements;
                countTaggedElements = newTaggedElements;
            }, 50);
        },

        hideDifficultyHelper: function(elem, result) {
            if (result == window["BLINDCODECONSTANTS"].CHANGE_NOTHING) return;
            else if (result == window["BLINDCODECONSTANTS"].CHANGE_TEXT_AND_BACKGROUND) {
                elem.style.color = window["BLINDCODECONSTANTS"].HIDDEN_TEXT_COLOR;
                elem.style.backgroundColor = window["BLINDCODECONSTANTS"].HIDDEN_BACKGROUND_COLOR;
            } else if (result == window["BLINDCODECONSTANTS"].CHANGE_TEXT)
                elem.style.color = window["BLINDCODECONSTANTS"].HIDDEN_TEXT_COLOR;
            else if (result == window["BLINDCODECONSTANTS"].CHANGE_BACKGROUND) 
                elem.style.backgroundColor = window["BLINDCODECONSTANTS"].HIDDEN_BACKGROUND_COLOR;
            else return;

            elem.setAttribute(window["BLINDCODECONSTANTS"].CHANGED_ATTR, result);
            elem.setAttribute(window["BLINDCODECONSTANTS"].TEXT_CONTENT_ATTR, elem.textContent);
            if (!elem.classList.contains(window["BLINDCODECONSTANTS"].CLASS_TAG_ADDITION))
                elem.classList.add(window["BLINDCODECONSTANTS"].CLASS_TAG_ADDITION);
            elem.textContent = window["BLINDCODECONSTANTS"].HIDDEN;
            this.stayHiddenIntervals.push(setInterval(() => {
                var tempTextContent = elem.textContent;
                elem.textContent = window["BLINDCODECONSTANTS"].HIDDEN;
                if (tempTextContent != window["BLINDCODECONSTANTS"].HIDDEN)
                    elem.setAttribute(window["BLINDCODECONSTANTS"].TEXT_CONTENT_ATTR, tempTextContent);
            }, 0));
        },

        showDifficulty: function() {
            clearInterval(this.repeatedlyHideInterval);
            this.repeatedlyHideInterval = null;
            document.body.removeEventListener("click", this.clickHideEventListener);

            for (var i = 0; i < this.stayHiddenIntervals.length; i++) 
                clearInterval(this.stayHiddenIntervals[i]);
            this.stayHiddenIntervals = [];

            this.forAllHTMLElements(elem => {
                if (!elem.hasAttribute(window["BLINDCODECONSTANTS"].CHANGED_ATTR)) return;

                var changed = elem.getAttribute(window["BLINDCODECONSTANTS"].CHANGED_ATTR);        
                if (changed == window["BLINDCODECONSTANTS"].CHANGE_TEXT_AND_BACKGROUND) {
                    elem.style.color = "";
                    elem.style.backgroundColor = "";
                } else if (changed == window["BLINDCODECONSTANTS"].CHANGE_TEXT) elem.style.color = "";
                else if (changed == window["BLINDCODECONSTANTS"].CHANGE_BACKGROUND) elem.style.backgroundColor = "";
                else return;

                elem.textContent = elem.getAttribute(window["BLINDCODECONSTANTS"].TEXT_CONTENT_ATTR);

                elem.removeAttribute(window["BLINDCODECONSTANTS"].CHANGED_ATTR);
                elem.removeAttribute(window["BLINDCODECONSTANTS"].TEXT_CONTENT_ATTR);
                elem.classList.remove(window["BLINDCODECONSTANTS"].CLASS_TAG_ADDITION);
            });
        },

        forAllHTMLElements: function(operation) {
            var allElems = document.getElementsByTagName('*');
            for (var i = 0; i < allElems.length; i++)
                operation(allElems[i]);
        },

        convertColorToRGB: function(color) {
            return (color.substring(0, 4) === 'rgba') ? 'rgb' + color.substring(4, color.lastIndexOf(',')) + ')' : color;
        }

    }

    window["Blindcode"].init();

}
