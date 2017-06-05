import plumber from 'gulp-plumber';

export default function (log) {
	return plumber({
		errorHandler(err) {
			log(err);
			// And this makes it so "watch" can continue after an error.
			this.emit('end');
		}
	});
}
