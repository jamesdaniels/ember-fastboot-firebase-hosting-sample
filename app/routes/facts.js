import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Route.extend({
    fastboot: Ember.inject.service(),
    model() {
        let shoebox = this.get('fastboot.shoebox');
        let isFastBoot = this.get('fastboot.isFastBoot');
        if (isFastBoot) {
            let responseHeaders = this.get('fastboot.response.headers');
            responseHeaders.set('Cache-Control', 'public, max-age=300, s-maxage=600');
            return fetch("https://ember-ssr-j6q.firebaseio.com/facts.json").then(function(response) {
                return response.json();
            }).then(function(json) {
                shoebox.put('facts', json);
                return json;
            });
        }
        return shoebox.retrieve('facts');
    }
});
