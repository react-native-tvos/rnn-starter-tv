import { stores } from '../../stores';

export class CounterApi {
  get = async (local?: boolean): PVoid => {
    const { counter } = stores;

    counter.setLoading(true);

    let json: CounterGetResponse;
    if (local) {
      const max = 100;
      json = {
        value: Math.floor(Math.random() * max),
      };
    } else {
      const resp = await fetch('https://cli-rn.batyr.io/api/counter');
      json = await resp.json();
    }

    counter.set(json.value);
    counter.setLoading(false);
  };
}
