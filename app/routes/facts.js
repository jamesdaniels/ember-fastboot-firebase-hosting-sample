import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Route.extend({
    fastboot: Ember.inject.service(),
    async model() {
        const isFastBoot = this.get('fastboot.isFastBoot');
        if (isFastBoot) {
            const responseHeaders = this.get('fastboot.response.headers');
            responseHeaders.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        }
        const shoebox = this.get('fastboot.shoebox');
        const shoeboxFacts = shoebox && shoebox.retrieve('facts');
        if (shoeboxFacts) {
            return shoeboxFacts;
        } else {
            const facts = await fetch("https://ember-ssr-j6q.firebaseio.com/facts.json").then(r => r.json());
            if (isFastBoot) { await shoebox.put('facts', facts); }
            return facts;
        }
    }
});
