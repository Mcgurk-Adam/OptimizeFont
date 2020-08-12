exports.handler = async (ev, context) => {
	return {
		statusCode: 200,
		body: JSON.stringify(context)
	};
}
