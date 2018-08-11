function formatDate(date) {
	var d = new Date(date);
	var years = d.getFullYear();
	var month = add_zero(d.getMonth() + 1);
	var days = add_zero(d.getDate());
	var hours = add_zero(d.getHours());
	var minutes = add_zero(d.getMinutes());
	var seconds = add_zero(d.getSeconds());
	return years + "-" + month + "-" + days + " " + hours + ":" + minutes + ":" + seconds;
}

exports.formatDate = formatDate;
exports.formatDate = formatDate;