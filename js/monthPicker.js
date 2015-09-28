/**
 * monthPicker.js
 * 
 * @auteur     marc laville
 * @Copyleft 2014
 * @date       26/01/2014
 * @version    0.5.1
 * @revision   $0$
 *
 * un month-picker pur Javascript
 * 
 *
 * A Faire
 * -position du tip ( west, east, north, south )
 * - localisation
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

/*
 * L'Objet Date sait revenyer la liste des noms de mois
 */
Date.monthNames = Date.monthNames || function( lang ) {
	var arrMonth = [],
		dateRef = new Date(),
		year = dateRef.getFullYear(),
        // Firefox don't support parametres, so we construct option to conform to Firefox format
 //       options = {weekday: "long", year: "numeric", month: "long", day: "numeric"};
        options = { month: "long" };
    
    lang = lang || 'fr-FR';

	dateRef.setMonth(0);
	dateRef.setDate(11); // Eviter la fin de mois !!!
	while (year == dateRef.getFullYear()) {
		/* push le mois en lettre et passe au mois suivant */
		arrMonth.push( dateRef.toLocaleString(lang, options) );
		dateRef.setMonth( dateRef.getMonth() + 1);
	}
	
	return arrMonth;
}

/**
 * Pour Instancier plusieurs month-picker par page,
 * on a besoin d'une fabrique ...
 */
var monthPickerFactory = (function ( document ) {
	var 
		/**
		 * Crétion d'une instance de monthPicker
		 * @element inputElt :  un element input
		 */
		monthPicker =  function ( inputElt, options ) {
			var valeur = inputElt.value,
				tabVal = valeur.split('/'), // Voir un regex pour généraliser la construction 
				b_mp = document.createElement('b'),
				span_mp = b_mp.appendChild( document.createElement('span') ),
				slct_year = span_mp.appendChild( document.createElement('select') ),
				/**
				 * clickBtnMois
				 * reponse à un click sur un bouton mois
				 * @event e : 
				 */
				clickBtnMois = function( e ) {
					var val = e.target.value,
						label = e.target.parentNode,
						labelNodeList = label.parentNode.getElementsByTagName('label');
					
					if(val == 'on') { // compatibilité Opera

						for (var i = 0; i < labelNodeList.length; ++i) {
							if( label == labelNodeList[i] ) val = i + 1;
						}
					}
					tabVal = [ val, slct_year.value ];
					inputElt.value = tabVal.join('/');
					 
					return;
				},			
				selectAnnee = function( e ) {
					tabVal[1] = slct_year.value;
					inputElt.value = tabVal.join('/');
				},
				fillSelect = function( an ) {
					an = an || (new Date()).getFullYear();
					for(var i = an - 3 ; i < an + 10 ; i++) {
						slct_year.appendChild( document.createElement('option') ).textContent = i;
						if( an == i ) {
							slct_year.lastChild.setAttribute( 'selected', 'selected' );
						}
					}
					slct_year.addEventListener( 'change', selectAnnee );
					
				},
				fillMois = function( mois, tabMois ) {
					var ajoutLabelMois = function( paramMois ) {
						return function( item, index ) {
							var lbl_mois  = document.createElement('label'),
								rd_mois = lbl_mois.appendChild( document.createElement('input') );
							
							rd_mois.value = index + 1;
							rd_mois.setAttribute( 'type', 'radio');
							rd_mois.setAttribute( 'name', 'mois');
							rd_mois.addEventListener( 'change', clickBtnMois );
							rd_mois.checked = ( paramMois == (index + 1) );
							if( rd_mois.value == '' && paramMois == index + 1 ) {
								rd_mois.value = 'on';
							}
							
							lbl_mois.appendChild( document.createElement('span') ).textContent = item;
							
							span_mp.appendChild( lbl_mois );
						};
					}
					
					
					tabMois = tabMois || Date.monthNames().map( function(str) { return ( str.length > 4 ) ? str.substr(0 , 3) + '.' : str; 
					} );
					mois = mois || (new Date()).getMonth() + 1;
					
					tabMois.forEach(ajoutLabelMois(mois));

					return;
				}, 				
				reflectSaisie = function( e ) {
					tabVal = e.target.value.toIntArray();
					
					if( tabVal.length ) {
						span_mp.querySelectorAll('label input').item(tabVal[0] - 1).checked = true;
						if( tabVal.length > 1 )
							slct_year.value = tabVal[1];
					}
				};
				
			b_mp.classList.add( 'month-picker' );

			inputElt.classList.add( 'month-picker' );
			fillSelect( ( tabVal.length > 1 ) ? parseInt( tabVal[1] ) : null );
			span_mp.appendChild( document.createElement('br') );
			fillMois( ( tabVal.length ) ? parseInt( tabVal[0] ) : null );
			
			inputElt.parentNode.insertBefore(b_mp, inputElt);
			b_mp.insertBefore(inputElt, span_mp);
			
			inputElt.addEventListener( 'input', reflectSaisie );
			
			return b_mp;
		};

	return {
		createMonthPicker : monthPicker
	}
})(window.document);

// Start
monthPickerFactory.createMonthPicker( document.getElementById('mois') );
