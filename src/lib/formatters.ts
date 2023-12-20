const NUMBER_FORMATTER = new Intl.NumberFormat(undefined, {
	minimumFractionDigits: 2,
	maximumFractionDigits: 3
});

const FULL_NUMBER_FORMATTER = new Intl.NumberFormat(undefined, {
	minimumFractionDigits: 6
});

export const formatCurrency = (value: number) => NUMBER_FORMATTER.format(value);
export const formatCurrencyFull = (value: number) => FULL_NUMBER_FORMATTER.format(value);

const PERCENT_FORMATTER = new Intl.NumberFormat(undefined, {
	maximumFractionDigits: 2,
	style: 'percent',
	minimumFractionDigits: 2
});

export const formatPercent = (value: number) => PERCENT_FORMATTER.format(value);
