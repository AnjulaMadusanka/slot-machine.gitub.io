$(document).ready(function(){
  const items = [
    "01", "02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25"
  ];
  let selectedItems  = new Set();
  let allSelectedItems = new Set();
  let prevSelected = {};
  const doors = document.querySelectorAll('.door');

  $("button").click(function(){
    spin();
  })
  init(true, 1, 1)
  document.body.onkeyup = function(e) {
    if (e.code === "Space") {
      spin();
    }
  }
  function init(firstInit = true, groups = 1, duration = 1) {
    selectedItems = new Set();
    allSelectedItems = new Set();
    prevSelected = {};

    for (const door of doors) {
      if (firstInit) {
        door.dataset.spinned = '0';
      } else if (door.dataset.spinned === '1') {
        continue;
      }

      const boxes = door.querySelector('.boxes');
      const boxesClone = boxes.cloneNode(false);
      const pool = ['00'];

      if (!firstInit) {
        const arr = [];
        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
          arr.push(...items);
        }
        pool.push(...shuffle(arr));

        boxesClone.addEventListener(
          'transitionstart',
          function () {
            door.dataset.spinned = '1';
            this.querySelectorAll('.box').forEach((box) => {
              box.style.filter = 'blur(1px)';
            });
          },
          { once: true }
        );

        boxesClone.addEventListener(
          'transitionend',
          function () {
            this.querySelectorAll('.box').forEach((box, index) => {
              box.style.filter = 'blur(0)';
              if (index > 0) this.removeChild(box);
            });
            door.dataset.spinned = '0';
          },
          { once: true }
        );
      }

      for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement('div');
        box.classList.add('box');
        box.style.width = door.clientWidth + 'px';
        box.style.height = door.clientHeight + 'px';
        box.textContent = pool[i];
        result= pool[i]
        boxesClone.appendChild(box);
      }
      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
      door.replaceChild(boxesClone, boxes);
    }
  }
  console.log(doors[2].childNodes)
   async function spin() {
    init(false, 4, 15);
    for (const door of doors) {
      const boxes = door.querySelector('.boxes');
      const doorId = door.getAttribute('id');
      const duration = parseInt(boxes.style.transitionDuration);

      const remainingItems = items.filter(item => !allSelectedItems.has(item));
      const shuffledItems = shuffle(remainingItems);

      boxes.style.transform = 'translateY(0)';
      prevSelected[doorId] = shuffledItems[0];

      let selectedItem = shuffledItems[0];

      while (selectedItems.has(selectedItem)) {
        shuffledItems.push(shuffledItems.shift());
        selectedItem = shuffledItems[0];
      }
      selectedItems.add(selectedItem);
      allSelectedItems.add(selectedItem);

      await new Promise((resolve) => setTimeout(resolve, duration * 1));
    }
  }
  function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }
});