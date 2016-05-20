'use strict';

import template from 'lodash/fp/template';
import { renderMsgLeft, renderMsgRight } from './utils/discussion';
import { renderShortcut } from './utils/shortcut';

$(document).ready(() => {
  let username = '';
  let $discuss = $('.discuss');

  if (typeof localStorage != 'undefined') {
    const localVars = JSON.parse(localStorage.getItem('jarvis'));

    username = localVars && localVars.username;
  }

  renderMsgLeft($discuss, !username ? 'What is your name ?' : 'Hi ' + username + '! How can i help you ?');

  $(document)
  .on('keypress', '.editor input', (e) => {
    if (e.keyCode === 13 )
      e.preventDefault();
    let value = $('.editor input').val();

    if (e.keyCode === 13 && value) {
      renderMsgRight($discuss, value);

      $('.editor input').val('');

      if (!username) {
        username = value;

        if (typeof localStorage != 'undefined') {
          localStorage.setItem('jarvis', JSON.stringify({
            'username': value
          }));
        }

        $.post('/reply', {'username': username, 'message': 'my name is ' + username})
          .done(response => {
            renderMsgLeft($discuss, response.reply);
          });
      } else {
        $.post('/reply', {'username': username, 'message': value})
          .done(response => {
            renderMsgLeft($discuss, response.reply);

            if (response.ext) {
              $('.extension').html(response.ext);
              $('.nav-tabs a[href="#view"]').tab('show');
            }
          });
      }
    }
  })
  .on('click', '#shortcut-submit', function (e) {
    const name = $('#shortcut-name').val().toLowerCase();
    const request = $('#shortcut-request').val();
    const shortcutElement = renderShortcut(name, request);

    $('#shortcuts').append(shortcutElement);
    $('[data-toggle="tooltip"]').tooltip();
    $('.nav-tabs a[href="#shortcuts"]').tab('show');
    $('#addShortcutDialog').modal('hide');
  });

  $('#addShortcutDialog').on('show.bs.modal', function (e) {
    let value = $('.editor input').val();

    $('#shortcut-request').val(value);
  });
});
