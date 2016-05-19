'use strict';

import { renderMsgLeft, renderMsgRight } from './utils/discussion';

$(document).ready(() => {
  let username = '';
  let $discuss = $('.discuss');

  renderMsgLeft($discuss, "What is your name ?");

  $(document).on('keypress', '.editor input', (e) => {
    if (e.keyCode === 13 )
      e.preventDefault();
    let value = $('.editor input').val();

    if (e.keyCode === 13 && value) {
      renderMsgRight($discuss, value);

      $('.editor input').val('');

      if (!username) {
        username = value;
        $.post('/reply', {'username': username, 'message': 'my name is ' + username})
          .done(response => {
            renderMsgLeft($discuss, response.reply);
          });
      } else {
        $.post('/reply', {'username': username, 'message': value})
          .done(response => {
            renderMsgLeft($discuss, response.reply);

            if (response.ext)
              $('.extension').html(response.ext);
              $('.nav-tabs a[href="#view"]').tab('show');
          });
      }
    }
  });
});
