/**
 * monthPicker.js
 * 
 * @auteur     marc laville
 * @Copyleft 2014
 * @date       26/01/2014
 * @version    0.5
 * @revision   $0$
 *
 * un month-picker pur Javascript
 * 
 * @date revision 21/09/2014 restitue la valeur du champ texr dans le panneau de saisie
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
/**
 * A Faire
 * -position du tip ( west, east, north, south )
 * - localisation
*/

/*
 * L'Objet Date sait revenyer la liste des noms de mois
 */
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
				tabVal = valeur.toIntArray(), // Voir un regex pour généraliser la construction 
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
					inputElt.value = '' + tabVal[0]  + '/' + tabVal[1];
					 
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
						
						slct_year.lastChild.setAttribute( 'value', i );
						if( an == i ) {
							slct_year.lastChild.setAttribute( 'selected', 'selected' );
						}
					}
					slct_year.addEventListener( 'change', selectAnnee );
					
				},
				fillMois = function( mois, nom, tabMois ) {
					var ulMois = document.createElement('ul');
					
					tabMois = tabMois || Date.monthNames().map( function(str) { return ( str.length > 4 ) ? str.substr(0 , 3) + '.' : str; } );
					mois = mois || (new Date()).getMonth() + 1;
					
					for(var i = 0, lbl_mois, rd_mois ; i < tabMois.length ; i++) {
						lbl_mois  = document.createElement('label'),
						rd_mois = lbl_mois.appendChild( document.createElement('input') );
							
						rd_mois.value = i + 1;
						rd_mois.setAttribute( 'type', 'radio');
						rd_mois.setAttribute( 'name', 'mois-' + nom );
						rd_mois.addEventListener( 'change', clickBtnMois );
						rd_mois.checked = ( mois == i + 1 );
						if( rd_mois.value == '' && mois == i + 1 ) {
							rd_mois.value = 'on';
						}
						lbl_mois.appendChild( document.createElement('span') ).textContent = tabMois[i];
						
//						span_mp.appendChild( lbl_mois );
						ulMois.appendChild( document.createElement('li') ).appendChild( lbl_mois );
//						ulMois.appendChild( lbl_mois );
					}
					
					return span_mp.appendChild( ulMois );
				},
				/*
				 * Restitue la valeur de l'input sur la panneau
				 */
				setValue = function( str ) {
					var tabVal = str.toIntArray();
					
					radios = span_mp.querySelectorAll('ul li input');
					for( var i = 0 ; i < radios.length ; i++ ) {
						var rd = radios[i];
						
						if( rd.value == tabVal[0] ) {
							rd.checked = true;
						}
					}
					slct_year.value = tabVal[1];
				};
				
			b_mp.classList.add( 'month-picker' );

			inputElt.classList.add( 'month-picker' );
			fillSelect( ( tabVal.length > 1 ) ? parseInt( tabVal[1] ) : null );
			span_mp.appendChild( document.createElement('br') );
			fillMois( ( tabVal.length ) ? parseInt( tabVal[0] ) : null , inputElt.getAttribute('name') );
			
			inputElt.parentNode.insertBefore(b_mp, inputElt);
			b_mp.insertBefore(inputElt, span_mp);
			setValue( inputElt.value )
			inputElt.addEventListener( 'change', function( e ) {
				return setValue( e.target.value ) ;
			});
			
			return b_mp;
		};

	return {
		createMonthPicker : monthPicker
	}
})(window.document);
