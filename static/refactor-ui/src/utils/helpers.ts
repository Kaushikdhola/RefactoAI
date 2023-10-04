const prepareQueryParamsFromObject = (params: any) => {
	return new URLSearchParams(params || {})?.toString();
}

export { prepareQueryParamsFromObject }
