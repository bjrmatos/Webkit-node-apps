var root = process.cwd(),
    nw = require("nw.gui");
var win = nw.Window.get();
win.isMaximized = !1;

/*
 * Micro framework templating
 * example mk.tpl('body',{title:'title'},callback);
 * call with $(title)
 */
var mk = (function() {
    'use strict';

    return {
        tpl: function(element, args, callback) {
            var el = document.querySelector(element);
            if (!el) return;
            var b = el.innerHTML,
                c = this.df(b, args);
            el.innerHTML = c;
            if (typeof callback !== 'undefined') {
                callback(el);
            }
        },
        df: function(b, d) {
            var re = /\$\{|\}/,
                u = b.split(re),
                c = u.length;
            for (var i = 1; i < c; i++) {
                if (d.hasOwnProperty(u[i])) {
                    u[i] = d[u[i]];
                }
            }
            var s = u.join('');
            return s;
        }
    };
})();



// simple WebSql app
var myEvents = (function() {

    'use strict';

    return {

        db: '',
        // default options
        cache: {
            db_name: 'dbEvents',
            db_table: 'events',
            db_version: '0.1',
            db_description: 'A Database of Events',
            db_not_support: 'WebSQL is not supported by your browser!',
            db_valid_form: 'You must enter a something!',
            db_error: 'db not found, your browser does not support web sql!'
        },

        run: function() {
            var self = this;

            windows();

            if (window.openDatabase) {
                this.db = openDatabase(self.cache.db_name, self.cache.db_version, self.cache.db_description, 1024 * 1024);
                this.db.transaction(function(t) {
                    t.executeSql('CREATE TABLE IF NOT EXISTS ' + self.cache.db_table + ' (id INTEGER PRIMARY KEY ASC, date TEXT, hour TEXT, title TEXT, description TEXT)');
                });

            } else {
                // not support
                alert(self.cache.db_not_support);
            }

            // Hide preloader on load
            var t = setTimeout(function() {
                var self = this;
                document.querySelector('.preloader').classList.add('loaded');
                clearTimeout(t);
            }, 2000);

            // show envets
            this.outputEvents();
            // init functions
            this.fns();

        },

        fns: function() {
            var self = this;
            // open modal
            document.getElementById('modal_open')
                .addEventListener('click', function(e) {
                    self.showOrhide(e);
                }, false);
            // close modal
            document.getElementById('modal_close')
                .addEventListener('click', function(e) {
                    self.showOrhide(e);
                }, false);
            // add event and hide modal
            document.getElementById('dbAdd')
                .addEventListener('click', function(e) {
                    e.preventDefault();
                    self.addEvent();
                }, false);
            // delete event and hide modal
            document.getElementById('dbDel')
                .addEventListener('click', function(e) {
                    e.preventDefault();
                    if (self.confirm('Are you sure') === true) {
                        self.drop();
                        document.querySelector('.modal-overlay')
                            .classList.remove('show');
                        document.getElementById('dbEvents')
                            .innerHTML = 'Clear Database....';
                        self.refresh(2000);
                    }
                }, false);

        },
        // modal function
        showOrhide: function(e) {
            var modal = document.querySelector('.modal-overlay');
            e.preventDefault();
            if (modal.classList.contains('show')) {
                modal.classList.remove('show');
            } else {
                modal.classList.add('show');
            }
        },
        // confirm fn
        confirm: function(msg) {
            var data = confirm(msg + " ?");
            return data;
        },
        // refresh on delete
        refresh: function(time) {
            var t = setTimeout(function() {
                //window.location.reload(); 
                clearTimeout(t);
            }, time);
        },
        // delete
        drop: function() {
            var self = this;
            self.db.transaction(function(tx) {
                tx.executeSql('DROP TABLE ' + self.cache.db_table, [], self.outputEvents(), function onError(tx, error) {
                    document.getElementById('dbEvents').innerHTML = '<p class="error">Error: ' + error.message + '</p>';
                });
            });
        },
        // add event
        addEvent: function() {
            var self = this;
            if (this.db) {
                var date = document.getElementById('dbDate').value;
                var hour = document.getElementById('dbHour').value;
                var title = document.getElementById('dbTitle').value;
                var desc = document.getElementById('dbDescription').value;
                // if not empty values
                if (date !== '' && hour !== '' && title !== '' && desc !== '') {
                    self.db.transaction(function(t) {
                        t.executeSql('INSERT INTO ' + self.cache.db_table + ' (date,hour,title,description) VALUES (?,?,?,?)', [date, hour, title, desc]);
                        self.outputEvents();
                        document.getElementById('dbForm').reset();
                        document.querySelector('.modal-overlay').classList.remove('show');
                    });
                } else {
                    alert(self.cache.db_valid_form);
                }
            } else {
                alert(this.cache.db_error);
            }
        },
        // update events
        updateEvents: function(transaction, results) {

            var self = this,
                result = document.getElementById('dbEvents'),
                json = document.getElementById('dbJson'),
                i, html = '',
                out = '';

            result.innerHTML = '';

            for (i = 0; i < results.rows.length; i++) {

                var row = results.rows.item(i);
                out += JSON.stringify(row, undefined, 2) + ',\n';
                html += '<li>' +
                    '<a class="eventDel" href="javascript:void(0);" onclick="myEvents.deleteEvent(' + row.id + ');">&times;</a>' +
                    '<h3>' + row.title + '</h3>' +
                    '<div class="eventDate">' +
                    '<span class="in-left">' + row.date + '</span>' +
                    '<span class="in-right">' + row.hour + '</span>' +
                    '</div>' +
                    '<div class="eventDesc" contenteditable  onkeyup="myEvents.updateEvent(' + row.id + ', this)">' +
                    row.description +
                    '</div>' +
                    '</li>';

            }

            result.innerHTML = html;
            // very simple json output
            // but if work not touch :)
            out = out.replace(/,\s*$/, "");
            json.textContent = '[' + out + ']';
        },
        // update event
        updateEvent: function(id, el) {
            var self = this;
            this.db.transaction(function(tx) {
                tx.executeSql('UPDATE ' + self.cache.db_table + ' SET description = ? WHERE id = ?', [el.textContent, id], null, function() {
                    alert(self.cache.db_error);
                });
            });
        },
        // show events in html
        outputEvents: function() {
            var self = this;
            if (this.db) {
                this.db.transaction(function(t) {
                    t.executeSql('SELECT * FROM ' + self.cache.db_table, [], self.updateEvents);
                });
            } else {
                alert(self.cache.db_error);
            }
        },
        // delete event
        deleteEvent: function(id) {
            var self = this;
            if (this.db) {
                if (this.confirm('Are you sure') === true) {
                    self.db.transaction(function(t) {
                        t.executeSql('DELETE FROM ' + self.cache.db_table + ' WHERE id=?', [id], self.outputEvents());
                    });
                }
            } else {
                alert(self.cache.db_error);
            }
        }

    };


    function qS(e){
        return document.querySelector(e);
    }

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
})();



window.addEventListener('DOMContentLoaded', function() {
    // text of html
    mk.tpl('#page', {
        preloader_title: 'Loading',
        preloader_description: 'Please Wait....',
        dbSection_title: 'Add Events',
        dbSection_description: 'Also you can edit description and delete (<b>Note:</b> You can see changes in next time ) ',
        modal_title: 'Add',
        modal_form_date: 'Date',
        modal_form_hour: 'Hour',
        modal_form_title: 'Title',
        modal_form_description: 'Description',
        modal_form_submit: 'Save',
        modal_form_delete: 'Delete table'
    });

    myEvents.run();

}, false);
