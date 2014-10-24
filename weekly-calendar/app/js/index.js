"use strict";
(function() {
    var root = process.cwd(),
        nw = require("nw.gui");
    var win = nw.Window.get();
    win .isMaximized = !1;


    var weeklyCalendar = (function() {
        'use strict';
        return {
            run: function() {
                windows();
                init();
            }
        };

        function windows() {

            var win_minimize = qS('#minimize'),
                win_maximize = qS('#maximize'),
                win_close = qS('#close');

            // show devtools with f12
            window.addEventListener('keydown', function(e) {
                if (e.which == 123 /*F12*/ ) {
                    e.preventDefault();
                    win.showDevTools();
                    return true;
                } else if (e.which == 114 && e.altKey) {
                    e.preventDefault();
                    win.hide();
                    return true;
                } else if (e.which == 116 && e.altKey) {
                    e.preventDefault();
                    window.location.reload();
                    return true;
                }
            });


            win_minimize.addEventListener('click', function(e) {
                e.preventDefault();
                win.minimize();
            });
            win_maximize.addEventListener('click', function(e) {
                e.preventDefault();
                win.isMaximized ? win.unmaximize() : win.maximize();
            });
            win_close.addEventListener('click', function(e) {
                e.preventDefault();
                win.close();
            });

            win.on("maximize", function() {
                win.isMaximized = !0
            });
            win.on("unmaximize", function() {
                win.isMaximized = !1
            });
        }

        function init() {
            clock();
            for (var i = 1; i < 56; i++) {
                var key = '#id_' + i;
                set(key);
            }
            assign();
            var second = 1000;
            setInterval(function() {
                clock();
                assign();
            }, second * 10);
        }

        function qS(element) {
            return document.querySelector(element);
        }

        function assign() {
            var days = ['sun', 'mon', 'tu', 'we', 'thu', 'fri', 'sat'],
                time = new Date(),
                h = time.getHours(),
                n = days[time.getDay()],
                now = document.querySelector('[data-hour="' + h + '"]'),
                dayNow = document.querySelector('[data-now="' + h + '-' + n + '"]');
            if (now) {
                if (now.classList.contains('isNow')) {
                    dayNow.childNodes[1].classList.remove('isNow');
                    now.classList.remove('isNow');
                } else {
                    now.classList.add('isNow');
                    dayNow.childNodes[1].classList.add('isNow');
                }
            }
        }

        function set(key) {
            var el = document.querySelector(key);
            el.innerText = localStorage.getItem(el.id);
            el.addEventListener('keyup', function() {
                localStorage.setItem(this.id, this.value);
            }, false);
        }

        function clock() {
            var t = new Date(),
                h = t.getHours(),
                m = t.getMinutes(),
                s = t.getSeconds();
            m = ck(m);
            s = ck(s);
            var hd = h;
            document.getElementById('time').innerHTML = (hd = 0 ? "12" : hd > 12 ? hd - 12 : hd) + ":" + m + ":" + s + " " + (h < 12 ? "AM" : "PM");
            var it = setTimeout(function() {
                clock();
            }, 500);
        }

        function ck(i) {
            if (i < 10) {
                i = "0" + i;
            };
            return i;
        }
    })();
    window.addEventListener('load', weeklyCalendar.run);
})();
