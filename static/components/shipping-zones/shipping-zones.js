async function shippingZones(path) {
  const template = await loadTemplateAsync(path)
  Vue.component('shipping-zones', {
    name: 'shipping-zones',
    props: ['adminkey', 'inkey'],
    template,

    data: function () {
      return {
        zones: [],
        zoneDialog: {
          showDialog: false,
          data: {
            id: null,
            name: '',
            countries: [],
            cost: 0,
            currency: 'sat'
          }
        },
        currencies: [],
        shippingZoneOptions: [
          'Free (digital)',
          'Flat rate',
          'Worldwide',
          'Europe',
          'Australia',
          'Austria',
          'Belgium',
          'Brazil',
          'Canada',
          'Denmark',
          'Finland',
          'France',
          'Germany',
          'Greece',
          'Hong Kong',
          'Hungary',
          'Ireland',
          'Indonesia',
          'Israel',
          'Italy',
          'Japan',
          'Kazakhstan',
          'Korea',
          'Luxembourg',
          'Malaysia',
          'Mexico',
          'Netherlands',
          'New Zealand',
          'Norway',
          'Poland',
          'Portugal',
          'Romania',
          'Russia',
          'Saudi Arabia',
          'Singapore',
          'Spain',
          'Sweden',
          'Switzerland',
          'Thailand',
          'Turkey',
          'Ukraine',
          'United Kingdom**',
          'United States***',
          'Vietnam',
          'China'
        ]
      }
    },
    methods: {
      openZoneDialog: function (data) {
        data = data || {
          id: null,
          name: '',
          countries: [],
          cost: 0,
          currency: 'sat'
        }
        this.zoneDialog.data = data

        this.zoneDialog.showDialog = true
      },
      createZone: async function () {
        try {
          const {data} = await LNbits.api.request(
            'POST',
            '/customersupport/api/v1/zone',
            this.adminkey,
            {}
          )
          this.zones = data
        } catch (error) {
          LNbits.utils.notifyApiError(error)
        }
      },
      getZones: async function () {
        try {
          const {data} = await LNbits.api.request(
            'GET',
            '/customersupport/api/v1/zone',
            this.inkey
          )
          this.zones = data
        } catch (error) {
          LNbits.utils.notifyApiError(error)
        }
      },
      sendZoneFormData: async function () {
        this.zoneDialog.showDialog = false
        if (this.zoneDialog.data.id) {
          await this.updateShippingZone(this.zoneDialog.data)
        } else {
          await this.createShippingZone(this.zoneDialog.data)
        }
        await this.getZones()
      },
      createShippingZone: async function (newZone) {
        try {
          await LNbits.api.request(
            'POST',
            '/customersupport/api/v1/zone',
            this.adminkey,
            newZone
          )
          this.$q.notify({
            type: 'positive',
            message: 'Zone created!'
          })
        } catch (error) {
          LNbits.utils.notifyApiError(error)
        }
      },
      updateShippingZone: async function (updatedZone) {
        try {
          await LNbits.api.request(
            'PATCH',
            `/customersupport/api/v1/zone/${updatedZone.id}`,
            this.adminkey,
            updatedZone
          )
          this.$q.notify({
            type: 'positive',
            message: 'Zone updated!'
          })
        } catch (error) {
          LNbits.utils.notifyApiError(error)
        }
      },
      deleteShippingZone: async function () {
        try {
          await LNbits.api.request(
            'DELETE',
            `/customersupport/api/v1/zone/${this.zoneDialog.data.id}`,
            this.adminkey
          )
          this.$q.notify({
            type: 'positive',
            message: 'Zone deleted!'
          })
          await this.getZones()
          this.zoneDialog.showDialog = false
        } catch (error) {
          LNbits.utils.notifyApiError(error)
        }
      },
      async getCurrencies() {
        try {
          const {data} = await LNbits.api.request(
            'GET',
            '/customersupport/api/v1/currencies',
            this.inkey
          )

          this.currencies = ['sat', ...data]
        } catch (error) {
          LNbits.utils.notifyApiError(error)
        }
      }
    },
    created: async function () {
      await this.getZones()
      await this.getCurrencies()
    }
  })
}
