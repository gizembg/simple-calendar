(function (global) {


    var options = {
        ParentID: "divcalendartable",
        DaysOfWeek: [
            'MON',
            'TUE',
            'WED',
            'THU',
            'FRI',
            'SAT',
            'SUN'
        ],

        Months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        Format: 'dd/mm/yyyy'
    };

    var self

    var Calendar = function () {
        self = this;

        this.divId = options.ParentID;
        this.DaysOfWeek = options.DaysOfWeek;
        this.Months = options.Months;

        var d = new Date();
        this.CurrentDay = d.getDate();
        this.CurrentMonth = d.getMonth();
        this.CurrentYear = d.getFullYear();

        this.TodayMonth = options.Months[d.getMonth()];
        this.TodayYear = d.getFullYear();
        this.Today = d.getDate();

        this.markedDayElement = this.CurrentDay;
        this.clickedDay = null;

        this.table = "";
        var f = options.Format;

        if (typeof (f) == 'string') {
            this.f = f.charAt(0).toUpperCase();
        } else {
            this.f = 'M';
        }
    }

    var note = function(text, date){
        this.text = text,
        this.date=  date
    }

    var noteList = [];

    noteList.push(new note("asd", "aaa"))
    console.log(noteList[0]);

    Calendar.prototype = {
        getDate: function () {
            return new Date();
        },
        setCalendarCells: function (y, m) {

            typeof (y) == 'number' ? this.CurrentYear = y: null;
            typeof (m) == 'number' ? this.CurrentMonth = m: null;

            // 1st day of the selected month
            var firstDayOfCurrentMonth = new Date(y, m, 1).getDay();

            // Last date of the selected month
            var lastDateOfCurrentMonth = new Date(y, m + 1, 0).getDate();

            // Last day of the previous month
            var lastDateOfLastMonth = m == 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate();

            // Write selected month and year. This HTML goes into <div id="month"></div>
            var monthandyearhtml = '<span id="monthandyearspan">' + this.Months[m] + ' - ' + y + '</span>';

            var html = '<p class = "yearmonth">' + this.CurrentYear + " " + options.Months[this.CurrentMonth] + '</p>'
            html += '<table class="table">';


            // Write the header of the days of the week
            html += '<tr>';

            for (var i = 0; i < 7; i++) {
                html += '<th class="daysheader">' + this.DaysOfWeek[i] + '</th>';
            }
            html += '</tr>';

            var p = dm = this.f == 'M' ? 1 : firstDayOfCurrentMonth == 0 ? -5 : 2;
            var cellvalue;

            for (var d, i = 0, z0 = 0; z0 < 6; z0++) {
                html += '<tr>';
                for (var z0a = 0; z0a < 7; z0a++) {
                    d = i + dm - firstDayOfCurrentMonth;

                    // Dates from prev month
                    if (d < 1) {
                        cellvalue = lastDateOfLastMonth - firstDayOfCurrentMonth + p++;
                        html += '<td id="prevmonthdates">' + '<span id="cellvaluespan">' + (cellvalue) + '</span><br/>' + '</td>';

                        // Dates from next month
                    } else if (d > lastDateOfCurrentMonth) {
                        html += '<td id="nextmonthdates" class="popup">' + (p++) + '</td>';

                        // Current month dates
                    } else {
                        html += '<td id="currentmonthdates">' + (d) + '</td>';
                        p = 1;
                    }
                    i++;
                }
                html += '</tr>';

            }
            // Closes table

            html += '</table>';


            html += '<div class = "buttons" ><button id="previousYear"><<</button>' +
                '<button id="previousMonth"><</button>' +
                '<button id="nextMonth">></button>' +
                '<button id="nextYear">>></button>' +
                '<button id="current">Today</button></div>';

            html += "<p>" + this.Today + " " + this.TodayMonth + " " + this.TodayYear + "</p>";

            html += "<div clas='notes'></div>"
            return html;

        },

        addCalendar: function (document, id) {
            document.getElementById(id).innerHTML = this.setCalendarCells(this.CurrentYear, this.CurrentMonth);
            this.addButtonListeners();
            this.markDay();


        },
        addButtonListeners() {
            document.getElementById("nextYear").onclick = this.nextYear.bind(this);
            document.getElementById("nextMonth").onclick = this.nextMonth.bind(this);
            document.getElementById("previousYear").onclick = this.previousYear.bind(this);
            document.getElementById("previousMonth").onclick = this.previousMonth.bind(this);
            document.getElementById("current").onclick = this.showToday.bind(this);

        },
        nextMonth: function () {
            if (this.CurrentMonth == 11) {
                this.CurrentMonth = 0;
                this.CurrentYear = this.CurrentYear + 1;

            } else {
                this.CurrentMonth = this.CurrentMonth + 1;

            };
            this.showCurrent();
        },

        previousMonth: function () {
            if (this.CurrentMonth == 0) {
                this.CurrentMonth = 11;
                this.CurrentYear = this.CurrentYear - 1;

            } else {
                this.CurrentMonth = this.CurrentMonth - 1;

            }
            this.showCurrent();
        },
        nextYear: function () {
            console.log("in nextYear")
            this.CurrentYear = this.CurrentYear + 1;
            console.log("this.CurrentYear == " + this.CurrentYear);

            this.showCurrent();




        },
        previousYear: function () {
            console.log("in previousYear")
            this.CurrentYear = this.CurrentYear - 1;
            this.showCurrent();



        },

        showCurrent: function () {
            document.getElementById(options.ParentID).innerHTML = this.setCalendarCells(this.CurrentYear, this.CurrentMonth);
            this.addButtonListeners();
            this.markDay();

        },

        showToday: function () {
            var d = new Date();
            var currentMonth = d.getMonth();
            var currentYear = d.getFullYear();

            document.getElementById(options.ParentID).innerHTML = this.setCalendarCells(currentYear, currentMonth);
            this.addButtonListeners();
            this.markDay();

        },
        markDay: function ()

        {
            for (const a of document.querySelectorAll("td")) {
                if (a.textContent === this.CurrentDay.toString() && a.id === "currentmonthdates") {
                    console.log("a.textContent", a.textContent)
                    this.currentDayElement = a;
                } 
                
                if (a.id === "prevmonthdates" || a.id === "nextmonthdates") {
                     a.style.color = "#c0bebe"
                } 
              
            }
            this.currentDayElement.style.border = "2px solid #9527bd"

            this.markedDay =  this.currentDayElement;

            document.addEventListener('click', function (e) {

                var clicked = e.target || e.srcElement,
                    text = clicked.textContent || clicked.innerText;

                if (clicked.id === "currentmonthdates" || clicked.id === "prevmonthdates" || clicked.id === "nextmonthdates") {
                    self.markedDay.style.background = "#ffffff"
                    self.markedDay = clicked;
                    self.markedDay.style.background = "#dddddd"

                }
                console.log("marked date ", self.markedDay)

            })
        },

    }
    global.Calendar = Calendar;

}(window))



//TODO: Takvim ilk açıldığında güncel gün seçili olmalı,
// başka gün seçildiğinde seçili gün o olmalu.