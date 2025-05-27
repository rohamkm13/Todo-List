
const calendarEl = document.getElementById("calendar");
const searchInput = document.getElementById("search-day");
const summaryEl = document.getElementById("summary");
let tasks = JSON.parse(localStorage.getItem("tasks") || "{}");

function toShamsi(gDate) {
  const j = jalaali.toJalaali(gDate);
  return { year: j.jy, month: j.jm, day: j.jd, wd: gDate.getDay() };
}

function getWeekdayName(wd) {
  return ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"][wd % 7];
}

function getMonthName(m) {
  return ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"][m - 1];
}

function renderCalendar(filter = "") {
  calendarEl.innerHTML = "";
  const today = new Date();
  const shamsi = toShamsi(today);
  const currentYear = shamsi.year;
  const currentMonth = shamsi.month;

  let total = 0, done = 0;

  for (let d = 1; d <= 31; d++) {
    const gDate = jalaali.toGregorian(currentYear, currentMonth, d);
    const g = new Date(gDate.gy, gDate.gm - 1, gDate.gd);
    if (g.getMonth() + 1 !== gDate.gm) continue;

    const wdName = getWeekdayName(g.getDay());
    const key = `${currentYear}-${currentMonth}-${d}`;
    const titleText = `${wdName} ${d} ${getMonthName(currentMonth)} ${currentYear}`;

    if (filter && !titleText.includes(filter)) continue;

    const card = document.createElement("div");
    card.className = "day-card";
    card.dataset.key = key;

    const title = document.createElement("h3");
    title.innerText = titleText;
    card.appendChild(title);

    const taskList = tasks[key] || [];

    taskList.forEach((task, i) => {
      const div = document.createElement("div");
      div.className = `task ${task.priority} ${task.done ? "done" : ""}`;
      
      const deleteBtn= document.createElement("button")
      deleteBtn.innerHTML='<i class="delete-btn fa fa-trash"></i>'
   
      deleteBtn.onclick= function (){
       taskList.splice(i,1);
       tasks[key]=taskList;
       localStorage.setItem("tasks",JSON.stringify(tasks));
      renderCalendar(filter);
      }
      
      const editBtn = document.createElement("button");
      editBtn.innerHTML='<i class="edit-btn fa fa-pen"></i>'
   
      editBtn.onclick = () => {
        const newTitle = prompt("ویرایش عنوان:", task.title);
        if (newTitle !== null) {
          task.title = newTitle;                   
          tasks[key] = taskList;
          localStorage.setItem("tasks", JSON.stringify(tasks));
          renderCalendar(filter);
        }
      };


      const notifyBtn = document.createElement('button');

notifyBtn.className = 'notify-btn fa fa-bell' ;







      
      const checkbox = document.createElement("input");
      checkbox.className="checkclass"
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.onchange = () => {
        task.done = checkbox.checked;
        saveTasks();

      
      
      
      
      // ------------------------------------------------------------------------------------------
        if (Notification.permission === "granted" && inputStart.value) {
        const now = new Date();
        const [h, m] = inputStart.value.split(":").map(Number);
        const taskTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
        const notifyTime = new Date(taskTime.getTime() - 30 * 60000); 
        const delay = notifyTime.getTime() - now.getTime();
        if (delay > 0) {
          setTimeout(() => {
            new Notification("یادآوری کار: " + inputTitle.value, {
              body: "زمان شروع: " + inputStart.value,
            });
          }, delay);
        }
      }

        renderCalendar(filter);
      };

      const label = document.createElement("span");
      label.className="txt"
      label.innerText = `${task.title} | ${task.start} `;

      div.append(notifyBtn,editBtn,deleteBtn,label,checkbox);
      card.appendChild(div);
      total++;
      if (task.done) done++;
    });

    if (taskList.length && taskList.every(t => t.done)) {
      card.classList.add("completed");
    }

    const inputTitle = document.createElement("input");
    inputTitle.placeholder = "Enter your task . . .";
    inputTitle.className="inTitle"
    const inputStart = document.createElement("input");
    inputStart.type = "time";
    inputStart.placeholder = "Enter your time . . .";
    inputStart.className='inTime'

    const select = document.createElement("select");
    ["low", "medium", "high"].forEach(p => {
      const opt = document.createElement("option");
      opt.value = p;
      opt.text = "Priority " + p[0].toUpperCase() + p.slice(1);
      select.appendChild(opt);
    });
  
    const btn = document.createElement("button");
    btn.innerText = "Add Task";
    btn.className='add-task'
    btn.onclick = () => {
      if (!tasks[key]) tasks[key] = [];
      tasks[key].push({
        title: inputTitle.value,
        start: inputStart.value,
        priority: select.value,
        done: false
      });
      saveTasks();

      if (Notification.permission === "granted" && inputStart.value) {
        const now = new Date();
        const [h, m] = inputStart.value.split(":").map(Number);
        const taskTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
        const notifyTime = new Date(taskTime.getTime() - 30 * 60000); 
        const delay = notifyTime.getTime() - now.getTime();
        if (delay > 0) {
          setTimeout(() => {
            new Notification("یادآوری کار: " + inputTitle.value, {
              body: "زمان شروع: " + inputStart.value,
            });
          }, delay);
        }
      }

      renderCalendar(filter);
    };

    card.append(inputTitle, inputStart, select, btn);
    calendarEl.appendChild(card);
  }

  const percent = total ? Math.round((done / total) * 100) : 0;
  summaryEl.innerText = `Tasks: ${total} | Done: ${done} | Completed: ${percent}%`;
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

searchInput.oninput = () => {
  const val = searchInput.value.trim();
  renderCalendar(val);
};

renderCalendar();

