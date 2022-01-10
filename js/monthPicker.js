/**
 * monthPicker.js
 * 
 * @auteur     marc laville
 * @Copyleft 	2022
 * @date       09/01/2022
 * @version    0.6
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
Date.monthNames = Date.monthNames || function (lang) {
   let arrMonth = [];
   const dateRef = new Date();
   const year = dateRef.getFullYear();
   // Firefox don't support parametres, so we construct option to conform to Firefox format
   // options = {weekday: "long", year: "numeric", month: "long", day: "numeric"};
   const options = { month: "long" };
   lang = lang || 'es-US';

   dateRef.setMonth(0);
   dateRef.setDate(11);
   while (year == dateRef.getFullYear()) {
      arrMonth.push(dateRef.toLocaleString(lang, options));
      dateRef.setMonth(dateRef.getMonth() + 1);
   }

   return arrMonth;
}

/**
 * Intance month-picker
 */
const monthPickerFactory = (function (document) {
   /**
    * 
    * @param {HTMLInputElement} inputElt 
    * @param {Object} options
    * @returns 
    */
   const monthPicker = function (elementId, options) {

      inputElt = document.querySelector(`#${elementId}`);

      const valeur = inputElt.value;
      let tabVal = valeur.split('/');
      const b_mp = document.createElement('b');
      const span_mp = b_mp.appendChild(document.createElement('span'));
      const slct_year = span_mp.appendChild(document.createElement('select'));

      const clickBtnMois = function (e) {
         let val = e.target.value,
            label = e.target.parentNode,
            labelNodeList = label.parentNode.getElementsByTagName('label');

         if (val == 'on') { // compatibilité Opera
            for (let i = 0; i < labelNodeList.length; ++i) {
               if (label == labelNodeList[i]) val = i + 1;
            }
         }

         tabVal = [val, '01', slct_year.value];

         const dateMDY = tabVal.join('/');
         const date = new Date(dateMDY);
         const dateMDY_end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

         const dateInput = new Date(dateMDY);
         const month = dateInput.toLocaleString('es-US', { month: 'long' });

         inputElt.setAttribute('data-start', dateMDY); /// save original date 
         inputElt.setAttribute('data-end', dateMDY_end.toLocaleDateString()); /// save original date 
         
         inputElt.value = `${month}/${slct_year.value}`; /// display formatted date

         let event = new Event("change");
         inputElt.dispatchEvent(event);

         return;
      }

      const selectAnnee = function (e) {
         tabVal[1] = slct_year.value;
         inputElt.value = tabVal.join('/');
      }

      const fillSelect = function (an) {
         an = an || (new Date()).getFullYear();
         for (let i = an - 3; i < an + 10; i++) {
            slct_year.appendChild(document.createElement('option')).textContent = i;
            if (an == i) {
               slct_year.lastChild.setAttribute('selected', 'selected');
            }
         }
         slct_year.addEventListener('change', selectAnnee);

      }

      const fillMois = function (mois, tabMois) {
         const ajoutLabelMois = function (paramMois) {
            return function (item, index) {

               const lbl_mois = document.createElement('label');
               let rd_mois = lbl_mois.appendChild(document.createElement('input'));

               rd_mois.value = index + 1;
               rd_mois.setAttribute('type', 'radio');
               rd_mois.setAttribute('name', 'mois');
               rd_mois.addEventListener('change', clickBtnMois);
               rd_mois.checked = (paramMois == (index + 1));
               if (rd_mois.value == '' && paramMois == index + 1) {
                  rd_mois.value = 'on';
               }

               lbl_mois.appendChild(document.createElement('span')).textContent = item;

               span_mp.appendChild(lbl_mois);
            };
         }

         tabMois = tabMois || Date.monthNames().map(function (str) {
            return (str.length > 4) ? str.substr(0, 3) + '.' : str;
         });
         mois = mois || (new Date()).getMonth() + 1;

         tabMois.forEach(ajoutLabelMois(mois));

         return;
      }

      const reflectSaisie = function (e) {
         tabVal = e.target.value.toIntArray();

         if (tabVal.length) {
            span_mp.querySelectorAll('label input').item(tabVal[0] - 1).checked = true;
            if (tabVal.length > 1)
               slct_year.value = tabVal[1];
         }
      };

      b_mp.classList.add('month-picker');

      inputElt.classList.add('month-picker');
      fillSelect((tabVal.length > 1) ? parseInt(tabVal[1]) : null);
      span_mp.appendChild(document.createElement('br'));
      fillMois((tabVal.length) ? parseInt(tabVal[0]) : null);

      inputElt.parentNode.insertBefore(b_mp, inputElt);
      b_mp.insertBefore(inputElt, span_mp);

      inputElt.addEventListener('input', reflectSaisie);

      return b_mp;
   };

   /**
    * 
    * @param {HTMLInputElement} elementId 
    * @returns {object}
    */
   const getValueInput = function (elementId) {

      inputElt = document.querySelector(`#${elementId}`);
      const start = inputElt.getAttribute('data-start');
      const end = inputElt.getAttribute('data-end');

      return {
         start,
         end
      };
   }

   return {
      create: monthPicker,
      getValue: getValueInput,
   }
})(window.document);