import * as React from "react"
import updateStateKeys from "../../helpers/update-state-keys"
import App from "../app"

export interface Helper {
  init: () => any,
  stepNext: (e?: React.FormEvent<HTMLElement>) => any,
  stepPrev: (e?: React.FormEvent<HTMLElement>) => any,
}

export default (app: App) => ({
  slickRef: React.createRef(),

  init() {
    const offset = app.isEditingSubscription() ? 2 : 0

    this.stepNext = this.stepNext.bind(this)
    this.stepPrev = this.stepPrev.bind(this)

    $(() => {
      this.slickRef = $(".bu-slick")
      .on("init afterChange", (_, {currentSlide}) => {
        app.setState(updateStateKeys({currentStepIndex: currentSlide + offset}))
      })
      .slick({
        accessibility: false,
        adaptiveHeight: true,
        arrows: false,
        draggable: false,
        infinite: false,
        swipe: false,
        touchMove: false,
      })
    })
    .on("beforeChange", () => {
      window.scroll({top: 0, behavior: "smooth"})
    })
  },

  stepNext(e) {
    if (e) { e.preventDefault() }
    this.slickRef.slick("slickNext")
  },

  stepPrev(e) {
    if (e) { e.preventDefault() }
    this.slickRef.slick("slickPrev")
  },
})
