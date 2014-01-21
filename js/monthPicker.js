/**
 * A Faire
 * -position du tip ( west, east, north, south )
 * - localisation
*/

/**
 * Pour Instancier plusieurs month-picker par page,
 * on a besoin d'une fabrique ...
 */
var monthPickerFactory = (function ( document ) {
	var 
		/**
		 * Crétion d'une instance de monthPicker
		 * @element inputElt : 
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
					tabVal = [ e.target.value, slct_year.value ];
					inputElt.value = '' + tabVal[0]  + '/' + tabVal[1];
					 
					return;
				},			
				selectAnnee = function( e ) {
					tabVal[1] = slct_year.value;
					inputElt.value = '' + tabVal[0]  + '/' + tabVal[1];
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
					tabMois = tabMois || ['Jan', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
					mois = mois || (new Date()).getMonth() + 1;
					
					for(var i = 0, lbl_mois, rd_mois ; i < tabMois.length ; i++) {
						lbl_mois  = document.createElement('label'),
						rd_mois = lbl_mois.appendChild( document.createElement('input') );
							
						rd_mois.value = i + 1;
						rd_mois.setAttribute( 'type', 'radio');
						rd_mois.setAttribute( 'name', 'mois');
						rd_mois.addEventListener( 'change', clickBtnMois );
						if( mois == i + 1 ) {
							rd_mois.checked = true;
						}
						
						lbl_mois.appendChild( document.createElement('span') ).textContent = tabMois[i];
						
						span_mp.appendChild( lbl_mois );
					}
					return;
				};
				
			b_mp.classList.add( 'month-picker' );

			inputElt.classList.add( 'month-picker' );
			fillSelect( ( tabVal.length > 1 ) ? parseInt( tabVal[1] ) : null );
			span_mp.appendChild( document.createElement('br') );
			fillMois( ( tabVal.length ) ? parseInt( tabVal[0] ) : null );
			
			inputElt.parentNode.insertBefore(b_mp, inputElt);
			b_mp.insertBefore(inputElt, span_mp);
			
			return b_mp;
		};

	return {
		createMonthPicker : monthPicker
	}
})(window.document);

window.addEventListener('load', function() {
	monthPickerFactory.createMonthPicker( document.getElementById('mois') );
	
	return;
});