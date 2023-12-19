# Fixed Rate Lending

## Overview
The vast majority of lending protocols follow a peer-to-pool approach that consist of variable rate models and governance. Risk-related factors and parameters such as interest rates are determined by governance in a reactive fashion as market conditions change. Even though this approach has been an innovation in DeFi and offers utility, fixed-rate lending is an untapped area.

Fixed-rate lending would allow borrowers to predict the costs of a given loan in contrast to the existing approach where costs change over time, degrading UX.

The primary parameters can be set by governance but some parameters can be set freely by participants. This would be achieved by an overcollateralized zero coupon bond-based P2P lending protocol.

Zero coupon bonds are a debt instrument that pay no interest, they rather trade at a discount and thus generate profit for the holder at maturity when redemeed.

Borrowers would set collateral in ratios pre-set by governance. Upon minting these bonds, users would be able to sell them on the market in return for the token they were looking to borrow.

Lenders would receive these bonds and exercise them for face-value at maturity.

### Here is a concrete example on the flow:

- Alice wants to borrow 1,000 USDC for 1 year.
The current market price for 1,000 USDC is 1,100 1-year USDC bonds.

- Alice provides enough INJ collateral to mint 1,100 1-year USDC bonds.
- She then proceeds to sell them in the market* for 1,000 USDC.

- Bob, who wanted to lend 1,000 USDC, had previously placed a limit order on the market to buy 1,100 1-year USDC bonds for 1,000 USDC.

- When Alice sells the bonds, Bob receives the 1,100 1-year USDC bonds which, at maturity, would be redeemable for their face value: 1,100 USDC. If we assume this transaction happened at the start of the 1-year period, then the implied interest rate for this loan would be 10%.

- Upon maturity, borrowers have the ability to repay the loan or the system will automatically roll the maturity one additional period. This ensures that there’s always principal for lenders to redeem. This system is overcollateralized and borrowers are subject to liquidations when the ratio drops below governance-defined thresholds.

We believe an orderbook design is more expressive as lenders can quote based on their views about interest rates. As bonds reach maturity or liquidation, the system requires sophisticated market makers to supply liquidity.

## Hackathon MVP

- A bond minting mechanism that accepts collateral and handles liquidations directly on Injective’s orderbook when it falls below a threshold.
- Create a website to incorporate the above design. The front-end should reflect on open positions and liquidation thresholds.
- The rollover mechanism does not need to be part of the MVP.


## Links
[Protocol docs](https://docs.injective.network/develop/modules/Injective/exchange/binary_options_markets/)

[Typescript SDK](https://github.com/InjectiveLabs/injective-ts) & [docs](https://docs.ts.injective.network/)

Notional Finance [product](https://notional.finance/) and [docs](https://docs.notional.finance/notional-v2/)

[Injective Testnet status](https://testnet.status.injective.network/)

