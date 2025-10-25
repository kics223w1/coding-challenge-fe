interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Added missing property
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { ...rest } = props; // Removed unused 'children'
  const balances = useWalletBalances();
  const prices = usePrices();

  // Moved outside component or use useCallback to prevent recreation
  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // Fixed: Changed lhsPriority to balancePriority
        // Fixed: Changed <= 0 to > 0 (keep positive balances only)
        // Fixed: Simplified logic - keep balances with valid priority and positive amount
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        // Fixed: Added explicit return for equal case
        // Sort in descending order (higher priority first)
        return rightPriority - leftPriority;
      });
  }, [balances]); // Fixed: Removed 'prices' from dependencies as it's not used here

  // Fixed: Combined formatting and rendering into one operation
  // This eliminates the unused formattedBalances variable
  const rows = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => {
      const formattedAmount = balance.amount.toFixed();
      const usdValue = prices[balance.currency] * balance.amount;
      
      return (
        <WalletRow
          // Fixed: Removed undefined 'classes.row'
          key={balance.currency} // Fixed: Use unique currency as key instead of index
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={formattedAmount}
        />
      );
    });
  }, [sortedBalances, prices]); // Now properly depends on both sortedBalances and prices

  return <div {...rest}>{rows}</div>;
};

export default WalletPage;