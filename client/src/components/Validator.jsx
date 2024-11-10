import React from 'react';
import _ from 'lodash';

const isAnyPartOfElementInViewport = (el) => {
	const rect = el.getBoundingClientRect(),
		windowHeight = (window.innerHeight || document.documentElement.clientHeight),
		windowWidth = (window.innerWidth || document.documentElement.clientWidth),
		vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0),
		horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
	return (vertInView && horInView);
};
/**
 * React Validator
*/
class ReactValidator {
	constructor(customRules = {}) {
		this.fields = {};
		this.fieldNames = [];
		this.errorMessages = {};
		this.messagesShown = {};
		this.rules = {
			accepted: {
				message: ':attribute must be accepted.',
				rule: (val) => val === true
			},
			alpha: {
				message: ':attribute may only contain letters.',
				rule: (val) => this._testRegex(val, /^$|^[A-Z]*$/i)
			},
			alpha_num: {
				message: ':attribute may only contain letters and numbers.',
				rule: (val) => this._testRegex(val, /^[A-Z0-9]*$/i)
			},
			alpha_num_dash: {
				message: ':attribute may only contain letters, numbers, and dashes.',
				rule: (val) => this._testRegex(val, /^[A-Z0-9_-]*$/i)
			},
			alpha_num_dash_space: {
				message: ':attribute may only contain letters, numbers, dashes and spaces.',
				rule: (val) => this._testRegex(val, /^[a-zA-Z\d\-_\s]+$/i)
			},
			name: {
				message: ':attribute may only contain letters and spaces',
				rule: (val) => this._testRegex(val, /^[a-zA-Z' ]+$/i)
			},
			corporate: {
				message: `:attribute may only contain letters, numbers, spaces and (\\),'._/-*&+`,
				rule: (val) => this._testRegex(val, /^[A-Za-z0-9 \\/_(,)*&+'.\\-]*$/i)
			},
			region: {
				message: ':attribute may only contain letters, numbers, & and spaces',
				rule: (val) => this._testRegex(val, /^[a-zA-Z0-9'&-. ]+$/i)
			},
			card_exp: {
				message: ':attribute must be a valid expiration date.',
				rule: (val) => this._testRegex(val, /^(([0]?[1-9]{1})|([1]{1}[0-2]{1}))\s?\/\s?(\d{2}|\d{4})$/)
			},
			card_num: {
				message: ':attribute must be a valid credit card number.',
				rule: (val) => this._testRegex(val, /^\d{4}\s?\d{4,6}\s?\d{4,5}\s?\d{0,8}$/)
			},
			currency: {
				message: ':attribute must be a valid currency.',
				rule: (val) => this._testRegex(val, /^\$?(\d{1,3}(\,?\d{3}))*\.?\d{0,2}$/)
			},
			decimal: {
				message: ':attribute must be a valid decimal.',
				rule: (val) => this._testRegex(val, /^\d*\.?\d*$/)
			},
			email: {
				message: ':attribute must be a valid email address.',
				rule: (val) => this._testRegex(val, /^$|^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)
			},
			address: {
				message: ':attribute must be a valid address.',
				rule: (val) => this._testRegex(val, /^[a-zA-Z0-9()\/'.#\\, -]*$/i)
			},
			gt: {
				message: ':attribute must be greater than :gt.',
				rule: (val, options) => {
					if(val) {
						return this._testRegex(val, /^\d+.?\d*$/) ? parseFloat(val) > parseFloat(options[0]) : false;
					}
					else {
						return true;
					}
				},
				messageReplace: (message, options) => message.replace(':gt', options[0])
			},
			gte: {
				message: ':attribute must be greater than or equal to :gte.',
				rule: (val, options) => {
					if(val) {
						return this._testRegex(val, /^\d+.?\d*$/) ? parseFloat(val) >= parseFloat(options[0]) : false;
					}
					else {
						return true;
					}
				},
				messageReplace: (message, options) => message.replace(':gte', options[0])
			},
			in: {
				message: 'selected :attribute must be :values.',
				rule: (val, options) => options.indexOf(val) > -1,
				messageReplace: (message, options) => message.replace(':values', this._toSentence(options))
			},
			integer: {
				message: ':attribute must be an integer.',
				rule: (val) => this._testRegex(val, /^\d+$/)
			},
			lt: {
				message: ':attribute must be less than :lt.',
				rule: (val, options) => {
					if(val) { 
						return this._testRegex(val, /^\d+.?\d*$/) ? parseFloat(val) < parseFloat(options[0]) : false;
					}
					return true;
				},
				messageReplace: (message, options) => message.replace(':lt', options[0])
			},
			lte: {
				message: ':attribute must be less than or equal to :lte.',
				rule: (val, options) => {
					if(val) {
						return this._testRegex(val, /^\d+.?\d*$/) ? parseFloat(val) <= parseFloat(options[0]) : false;
					}
					return true;
				},
				messageReplace: (message, options) => message.replace(':lte', options[0])
			},
			max: {
				message: ':attribute cannot be more than :max characters long.',
				rule: (val, options) => val.length <= options[0],
				messageReplace: (message, options) => message.replace(':max', options[0])
			},
			min: {
				message: ':attribute must be at least :min characters.',
				rule: (val, options) => val.length >= options[0],
				messageReplace: (message, options) => message.replace(':min', options[0])
			},
			not_in: {
				message: 'selected :attribute must not be :values.',
				rule: (val, options) => options.indexOf(val) === -1,
				messageReplace: (message, options) => message.replace(':values', this._toSentence(options))
			},
			numeric: {
				message: ':attribute must be a number.',
				rule: (val) => {
					if(val) {
						return this._testRegex(val, /^(\s*|\d+)$/)
					}
					return true;
				}
			},
			card: {
				message: ':attribute must be a number. (Ex: 1234 4567 XXXX XXXX).',
				rule: (val) => this._testRegex(val, /^(\s*|\d+)$/)
			},
			pass_number: {
				message: ':attribute must be a number.',
				rule: (val) => this._testRegex(val, /^(\s*|\d+)$/)
			},
			phone: {
				message: ':attribute must be a valid phone number.',
				rule: (val) => this._testRegex(val, /(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)/)
			},
			required: {
				message: ':attribute is required.',
				rule: (val) => this._testRegex(val, /.*[^ ].*/)
			},
			url: {
				message: ':attribute must be a url.',
				rule: (val) => this._testRegex(val, /^(https?|ftp):\/\/(-\.)?([^\s/?\.#-]+\.?)+(\/[^\s]*)?$/i)
			},
			equal: {
				message: ':attribute did not match.',
				rule: (val, options) => val == options[0]
			},
			edit_telephone: {
				message: ':attribute must be a valid Mobile number.',
				rule: (val) => {
					if(val) {
						return this._testRegex(val, /^\+?\d*$/)
					}
					return true;
				}
			},
			customRegex: {
				message: 'Please enter a valid :attribute',
				rule: (val, options) => {
					const regex = new RegExp(options[1], 'u');
					return this._testRegex(val, regex);
				},
				messageReplace: (message, options) => message
			},
			beneficiaryName: {
				message: `attribute may only contain letters, &, -, _, / ,() and spaces`,
				rule: (val) => this._testRegex(val, /^[a-zA-Z\/\.\()\-_\s]+$/i)
			},
			...customRules,
		};
	}

	getErrorMessages() {
		return this.errorMessages;
	}

	showMessages(fieldName) {
		if(fieldName) {
			this.messagesShown[fieldName] = true;
		} 
		else {
			for(let field of this.fieldNames) {
				this.messagesShown[field] = true;
			}
		}
	}

	hideMessages() {
		for (let field of this.fieldNames) {
			this.messagesShown[field] = false;
		}
	}

	/**
	 * Scroll to error
	 */
	scrollToError() {
		let element = document.getElementsByClassName('invalid-feedback');
		if(!_.isEmpty(element)) {
			let input = false;
			element = element[0];
			while(element.previousElementSibling) {
				element = element.previousElementSibling;
				if(element.tagName == "INPUT" || element.tagName == "TEXTAREA") {
					input = true;
					break;
				}
			}
			if(input) {
				element.focus();
				setTimeout(() => {
					if(!isAnyPartOfElementInViewport(element)) {
						window.scrollTo({
							top: element.offsetTop - 10,
							behavior: "smooth"
						})
					}
				}, 500);
			}
		}
	}

	// return true if all fields cleared, false if there is a validation error
	allValid() {
		for (var key in this.fields) {
			if (this.fieldValid(key) === false) {
				setTimeout(() => this.scrollToError(), 500);	
				return false;
			}
		}
		return true;
	}

	// return true if the one field passed in is valid, false if there is an error
	fieldValid(field) {
		return this.fields.hasOwnProperty(field) && this.fields[field] === true;
	}

	// if a message is present, generate a validation error react element
	customMessage(message, customClass) {
		if (message && this.messagesShown) {
			return this._reactErrorElement(message, customClass);
		}
	}

	message(field, value, testString, customClass, customErrors = {}, returnOnlymessage) {
		if (!this.fieldNames.includes(field)) {
			this.fieldNames.push(field);
		}
		this.messagesShown[field] = this.messagesShown[field] ? true : false;
		this.errorMessages[field] = null;
		this.fields[field] = true;
		var tests = testString.split('|');
		var rule, options, message;
		for (var i = 0; i < tests.length; i++) {
			// if the validation does not pass the test
			value = this._valueOrEmptyString(value);
			rule = this._getRule(tests[i]);
			if(rule !='customRegex') {
				options = this._getOptions(tests[i]);
			} else {
				options = this._getRegexOptions(tests[i]);
			}
			// test if the value passes validation
			if(this.rules[rule]) {
				if (this.rules[rule].rule.call(this, value, options) === false) {
					this.fields[field] = false;
					if (this.messagesShown[field]) {
						message = customErrors[rule] ||
							customErrors.default ||
							this.rules[rule].message.replace(':attribute', field.replace(/_/g, ' '));

						this.errorMessages[field] = message;
						if (options.length > 0 && this.rules[rule].hasOwnProperty('messageReplace')) {
							return this._reactErrorElement(this.rules[rule].messageReplace(message, options), '', returnOnlymessage);
						} else {
							return this._reactErrorElement(message, customClass, returnOnlymessage);
						}
					}
				}
			}
		}
	}
	// Private Methods
	_getRule(type) {
		return type.split(':')[0];
	}

	_getRegexOptions(type) {
		var parts = type.split(':');
		return parts;
	}

	_getOptions(type) {
		var parts = type.split(':');
		return parts.length > 1 ? parts[1].split(',') : [];
	}

	_valueOrEmptyString(value) {
		return typeof value === 'undefined' || value === null ? '' : value;
	}

	_toSentence(arr) {
		return arr.slice(0, -2).join(', ') +
			(arr.slice(0, -2).length ? ', ' : '') +
			arr.slice(-2).join(arr.length > 2 ? ', or ' : ' or ');
	}

	_reactErrorElement(message, customClass, returnOnlymessage) {
		if(returnOnlymessage) return message
		return React.createElement('div', {
			className: customClass || 'invalid-feedback'
		}, message);
	}

	_testRegex(value, regex) {
		return value.toString().match(regex) !== null;
	}
}

export default ReactValidator;