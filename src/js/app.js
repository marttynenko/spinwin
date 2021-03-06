let $app = new Vue({
  el: '#app',
  data: {
    wheel: null,
    //кол-во секторов на барабане
    sectors: 10,
    //позиция проигрышных секторов (четные или нет)
    isLosingEven: true,
    //url, на который будет отправляться запрос для определения
    //выигрыша/проигрыша
    url: './prizes/prize_2.json',
    prize: null,
    popupLose: false,
    popupWin: false
  },
  watch: {},
  computed: {},
  methods: {
    showLosePopup() {
      this.popupLose = !this.popupLose
      if (this.popupLose) {
        setTimeout(() => {
          gsap.set(this.wheel, {clearProps: 'all'})
        },500)
      }
    },
    showWinPopup() {
      this.popupWin = !this.popupWin
      if (this.popupWin) {
        setTimeout(() => {
          gsap.set(this.wheel, {clearProps: 'all'})
        },500)
      }
    },
    //случайное число в заданном интервале
    randomInteger(min, max) {
      let rand = min + Math.random() * (max + 1 - min);
      return Math.floor(rand);
    },
    //вычисляем продолжительность анимации в зависимости от
    //кол-ва градусов вращения колеса
    durationCalc(degrees) {
      //2.5 сек (значение взятое за эталон) - время 1 полного оборота колеса
      return (degrees / 360 * 2.5);
    },
    askServer() {
      // let randInt = this.randomInteger(1,10);
      // fetch(`./prizes/prize_${randInt}.json`)
      fetch(this.url)
        .then(response => response.json())
        .then(item => {
          if (+item.sector !== -1) {
            //выигрыш
            this.prize = item;
            const rotateParams = this.winRotateCalculate(+item.sector);
            this.winWheelRotate(rotateParams);
          } else {
            //проигрыш
            this.loseWheelRotate()
          }
        })
        .catch(error => {
          console.log(error)
        });
    },
    winRotateCalculate(sector) {
      //размер одного сектора в градусах
      const sectorSize = 360 / this.sectors
      
      //увеличиваем вращение на 1 полный оборот
      //если нужный сектор в первой половине круга
      if (sector <= 5) {
        sector += this.sectors
      }
      
      //добавляем щепотку хаоса
      if (Math.random() > 0.5) {
        sector += this.sectors
      }

      //получаем кол-во градусов вращения колеса
      let sectorPosition = sector * sectorSize

      //и еще немного хаоса
      sectorPosition = sectorPosition - this.randomInteger(1,sectorSize-1)
      //рассчитываем скорость вращения
      const duration = this.durationCalc(sectorPosition)
      
      return [sectorPosition,duration]
    },
    winWheelRotate(params) {
      gsap.to(this.wheel, {rotation: -params[0], duration: params[1], overwrite: true}).then(
        () => {
        setTimeout(() => {
          this.showWinPopup();
        },200)
      });
    },
    loseWheelRotate() {
      let rand = this.randomInteger(2,10);
      if (rand % 2 !== 0) {
        rand--;
      }
      //размер одного сектора в градусах
      const sectorSize = 360 / this.sectors
      
      //увеличиваем вращение на 1 полный оборот
      //если нужный сектор в первой половине круга
      if (rand <= 4) {
        rand += this.sectors
      }
      
      //добавляем щепотку хаоса
      if (Math.random() > 0.5) {
        rand += this.sectors
      }

      //получаем кол-во градусов вращения колеса
      let sectorPosition = rand * sectorSize

      //и еще немного хаоса
      sectorPosition = sectorPosition - this.randomInteger(1,sectorSize-1)
      //рассчитываем скорость вращения
      const duration = this.durationCalc(sectorPosition)

      gsap.to(this.wheel, {rotation: -sectorPosition, duration, overwrite: true}).then(
        () => {
        setTimeout(() => {
          this.showLosePopup();
        },200)
      });
    },
    popupLoseEnter(el,done) {
      const d = document
      const bg = d.querySelector('.popup-nowin-bg')
      const img = d.querySelector('.popup-nowin-img')
      const txt = d.querySelector('.popup-nowin-txt')

      let $tl = gsap.timeline()
      $tl.to(bg, {x: '0%', duration: 1})
          .to(img, {x: '0%', opacity: 1, duration: 0.8, delay: -0.75})
          .to(txt, {y: '0%', opacity: 1, duration: 0.5, delay: -0.3, onComplete: done})
    },
    popupLoseLeave(el,done) {
      const d = document
      const bg = d.querySelector('.popup-nowin-bg')
      const img = d.querySelector('.popup-nowin-img')
      const txt = d.querySelector('.popup-nowin-txt')

      let $tl = gsap.timeline()
      $tl.to(txt, {y: '-100%', opacity: 0, duration: 0.5})
          .to(img, {x: '-100%', opacity: 0, duration: 0.6, delay: -0.3})
          .to(bg, {x: '100%', duration: 0.6, delay: -0.6,onComplete: done})
    },
    //функции с суффиксом _random не исползуются!
    _randomWinOrLoss(degrees) {
      //определяем сектор, в котором остановится барабан
      const sector = parseInt(degrees / (360/this.sectors),10)
      console.log(sector)

      if (sector % 2 == 0) {
        //проигрыш
        this.showLosePopup()
      } else {
        //выигрыш
        this.showWinPopup()
      }
    },
    _randomWheelRotate() {
      let degrees = this.randomInteger(180,540);
      let duration = this.durationCalc(degrees);
      console.log(degrees,duration);

      //крутим барабан
      gsap.to(this.wheel, {rotation: degrees, duration, overwrite: true}).then(
        () => {
        this.askServer()

        setTimeout(() => {
          this.winOrLoss(degrees);
        },200)
      });
    }
  },
  mounted () {
    this.wheel = this.$refs.wheel
  }
})
