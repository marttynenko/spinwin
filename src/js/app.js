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
      // let randInt = this.randomInteger(1,5);
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
