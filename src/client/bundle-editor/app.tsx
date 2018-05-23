import * as React from "react"
import styled from "styled-components"

import {BACKGROUND_BLACK} from "../colors"

import bindCartHelper, {Helper as CartHelper} from "./app/cart-helper"
import bindExistingCustomerHelper, {Helper as ExistingCustomerHelper} from "./app/existing-customer-helper"
import bindStateHelper, {Helper as StateHelper} from "./app/state-helper"
import bindStepsHelper, {Helper as StepsHelper} from "./app/steps-helper"

import ChooseAddOns from "./components/choose-add-ons"
import ChooseFrequencySize from "./components/choose-frequency-size"
import ChooseProducts from "./components/choose-products"
import ProductDetails from "./components/choose-products/product-details"
import Confirm from "./components/confirm"
import EnterEmail from "./components/enter-email"
import EnterName from "./components/enter-name"
import ResponsiveEmbed from "./components/styled/responsive-embed"

import {
  getAvailableFrequencies,
  getAvailableSizes,
  getBundlePrice,
} from "../helpers/bundle"

import Modal from "../helpers/modal"

import updateStateKeys from "../helpers/update-state-keys"

interface Props {
  bundleAddOns: ShopifyProduct[],
  bundleId: number,
  bundleProductMetafields: ShopifyProductMetafield[],
  bundleProduct: ShopifyProduct,
  bundleProducts: ShopifyProduct[],
  customerHash: string,
  subscriptions: RechargeSubscription[],
}

interface State {
  availableFrequencies: number[],
  availableSizes: number[],
  bundleName: string,
  currentStepIndex: number,
  editingBundleId: number,
  enteredEmail: string,
  enteredName: string,
  isBundleFullModalOpen: boolean,
  isSubmitting: boolean,
  productDetailsModalProductId: number,
  selectedAddOnIds: number[],
  selectedBundlePrice: number,
  selectedFrequency: number,
  selectedProductIds: number[],
  selectedVariantIds: number[],
  selectedSize: number,
  videoModalYouTubeId: number,
}

export default class App extends React.Component<Props, State> {
  public state = {
    availableFrequencies: [],
    availableSizes: [],
    bundleName: "",
    currentStepIndex: null,
    editingBundleId: null,
    enteredEmail: "",
    enteredName: "",
    isBundleFullModalOpen: false,
    isSubmitting: false,
    productDetailsModalProductId: null,
    selectedAddOnIds: [],
    selectedBundlePrice: null,
    selectedFrequency: null,
    selectedProductIds: [],
    selectedSize: null,
    selectedVariantIds: [],
    videoModalYouTubeId: null,
  }

  private cartHelper: CartHelper
  private existingCustomerHelper: ExistingCustomerHelper
  private stateHelper: StateHelper
  private stepsHelper: StepsHelper

  constructor(props) {
    super(props)

    this.state.availableFrequencies = getAvailableFrequencies(props.bundleProductMetafields)
    this.state.availableSizes = getAvailableSizes(props.bundleProduct)

    this.cartHelper = bindCartHelper(this)
    this.existingCustomerHelper = bindExistingCustomerHelper(this)
    this.stepsHelper = bindStepsHelper(this)
    this.stateHelper = bindStateHelper(this)

    if (props.subscriptions) {
      const cartState = this.existingCustomerHelper.extractState()
      this.state = updateStateKeys(cartState)(this.state)
    } else {
      this.state.selectedFrequency = this.state.availableFrequencies[0]
      this.state.selectedSize = this.state.availableSizes[0]
      this.state.selectedBundlePrice = getBundlePrice(props.bundleProduct, this.state.selectedSize)
    }
  }

  public async componentDidMount() {
    const {
      bundleId,
      customerHash,
    } = this.props

    if (bundleId && !customerHash) {
      const cartState = await this.cartHelper.extractState(bundleId)
      this.setState(updateStateKeys(cartState))
    }

    this.stepsHelper.init()
  }

  public render() {
    const {
      bundleAddOns,
      bundleProductMetafields,
      bundleProducts,
    } = this.props

    const {
      currentStepIndex,
      isBundleFullModalOpen,
      productDetailsModalProductId,
      videoModalYouTubeId,
    } = this.state

    const {
      availableFrequencies,
      availableSizes,
      bundleName,
      editingBundleId,
      enteredEmail,
      enteredName,
      isSubmitting,
      selectedAddOnIds,
      selectedBundlePrice,
      selectedFrequency,
      selectedProductIds,
      selectedSize,
      selectedVariantIds,
    } = this.state

    const allProducts = bundleProducts.concat(bundleAddOns)
    const isEditingSubscription = this.isEditingSubscription()

    return (
      <>
        <Wrapper>
          <div className="bu-slick">
            {!isEditingSubscription && (
              <>
                <div>
                  <Step>
                    <EnterName
                      enterName={this.stateHelper.enterName}
                      enteredName={enteredName}
                      isActiveStep={currentStepIndex === 0}
                      stepNext={this.stepsHelper.stepNext}
                    />
                  </Step>
                </div>
                <div>
                  <Step>
                    <EnterEmail
                      enterEmail={this.stateHelper.enterEmail}
                      enteredEmail={enteredEmail}
                      enteredName={enteredName}
                      isActiveStep={currentStepIndex === 1}
                      stepNext={this.stepsHelper.stepNext}
                      stepPrev={this.stepsHelper.stepPrev}
                    />
                  </Step>
                </div>
              </>
            )}
            <div>
              <Step>
                <ChooseFrequencySize
                  availableFrequencies={availableFrequencies}
                  availableSizes={availableSizes}
                  bundleProductMetafields={bundleProductMetafields}
                  isActiveStep={currentStepIndex === 2}
                  isEditingSubscription={isEditingSubscription}
                  selectedBundlePrice={selectedBundlePrice}
                  selectedFrequency={selectedFrequency}
                  setSelectedFrequency={this.stateHelper.setSelectedFrequency}
                  selectedSize={selectedSize}
                  setSelectedSize={this.stateHelper.setSelectedSize}
                  stepNext={this.stepsHelper.stepNext}
                  stepPrev={this.stepsHelper.stepPrev}
                />
              </Step>
            </div>
            <div>
              <Step align="top">
                <div className="one-whole">
                  <ChooseProducts
                    addAddOnId={this.stateHelper.addAddOnId}
                    addVariantId={this.stateHelper.addVariantId}
                    allProducts={allProducts}
                    bundleName={bundleName}
                    bundleProducts={bundleProducts}
                    bundleProductMetafields={bundleProductMetafields}
                    isActiveStep={currentStepIndex === 3}
                    openProductDetailsModal={this.openProductDetailsModal}
                    openVideoModal={this.openVideoModal}
                    removeAddOnId={this.stateHelper.removeAddOnId}
                    removeVariantId={this.stateHelper.removeVariantId}
                    selectedAddOnIds={selectedAddOnIds}
                    selectedProductIds={selectedProductIds}
                    selectedSize={selectedSize}
                    selectedVariantIds={selectedVariantIds}
                    stepNext={this.stepsHelper.stepNext}
                    stepPrev={this.stepsHelper.stepPrev}
                    updateBundleName={this.stateHelper.updateBundleName}
                  />
                </div>
              </Step>
            </div>
            <div>
              <Step align="top">
                <div className="one-whole">
                  <ChooseAddOns
                    addAddOnId={this.stateHelper.addAddOnId}
                    addVariantId={this.stateHelper.addVariantId}
                    bundleAddOns={bundleAddOns}
                    bundleProductMetafields={bundleProductMetafields}
                    bundleProducts={bundleProducts}
                    isActiveStep={currentStepIndex === 4}
                    openProductDetailsModal={this.openProductDetailsModal}
                    openVideoModal={this.openVideoModal}
                    removeAddOnId={this.stateHelper.removeAddOnId}
                    removeVariantId={this.stateHelper.removeVariantId}
                    selectedAddOnIds={selectedAddOnIds}
                    selectedVariantIds={selectedVariantIds}
                    stepNext={this.stepsHelper.stepNext}
                    stepPrev={this.stepsHelper.stepPrev}
                  />
                </div>
              </Step>
            </div>
            <div>
              <Step align="top">
                <div className="one-whole">
                  <Confirm
                    allProducts={allProducts}
                    isActiveStep={currentStepIndex === 5}
                    isEditingBundle={!!editingBundleId}
                    isSubmitting={isSubmitting}
                    selectedFrequency={selectedFrequency}
                    selectedProductIds={selectedProductIds}
                    selectedSize={selectedSize}
                    stepPrev={this.stepsHelper.stepPrev}
                    submit={this.submit}
                  />
                </div>
              </Step>
            </div>
          </div>

          <Modal
            handleClose={this.handleBundleFullModalClose}
            isOpen={isBundleFullModalOpen}
          >
            Your bundle is full!
          </Modal>
        </Wrapper>

        <Modal
          handleClose={this.closeProductDetailsModal}
          isOpen={!!productDetailsModalProductId}
          style="panel"
        >
          {productDetailsModalProductId && (
            <ProductDetails
              closeProductDetailsModal={this.closeProductDetailsModal}
              product={allProducts.find(({id}) => id === productDetailsModalProductId)}
            />
          )}
        </Modal>

        <Modal
          handleClose={this.closeVideoModal}
          isOpen={!!videoModalYouTubeId}
        >
          <ResponsiveEmbed>
            <iframe
              allowFullScreen={true}
              frameBorder={0}
              height={360}
              src={`https://www.youtube.com/embed/${videoModalYouTubeId}?autoplay=1`}
              width={640}
            />
          </ResponsiveEmbed>
        </Modal>
      </>
    )
  }

  public isEditingSubscription = () => !!(this.props.customerHash && this.props.subscriptions)

  private submit = async () => {
    this.setState(updateStateKeys({isSubmitting: true}))

    if (this.isEditingSubscription()) {
      await this.existingCustomerHelper.submitBundleUpdates()
    } else {
      await this.cartHelper.submitBundleUpdates()
    }

    this.setState(updateStateKeys({isSubmitting: false}))
  }

  private handleBundleFullModalClose = () => {
    this.setState(updateStateKeys({isBundleFullModalOpen: false}))
  }

  private closeProductDetailsModal = () => {
    this.setState(updateStateKeys({productDetailsModalProductId: null}))
  }

  private openProductDetailsModal = (productDetailsModalProductId) => () => {
    this.setState(updateStateKeys({productDetailsModalProductId}))
  }

  private openVideoModal = (videoModalYouTubeId) => () => {
    this.setState(updateStateKeys({videoModalYouTubeId}))
  }

  private closeVideoModal = () => {
    this.setState(updateStateKeys({videoModalYouTubeId: null}))
  }
}

const Wrapper = styled.div`
  background: ${BACKGROUND_BLACK};
  color: #fff;
  a { color: #fff; }
`

interface StepProps {
  align?: "top"
}

const Step = styled.div`
  align-items: ${({align}: StepProps) => align === "top" ? "start" : "center"};
  display: flex;
  justify-content: center;
  min-height: calc(100vh - 87px); /* 87px = header height */

  > div { max-width: 800px; }
`
