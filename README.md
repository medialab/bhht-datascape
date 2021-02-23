# BHHT Datascape

Sources and scripts related to BHHT's static website hosted at this url: https://medialab.github.io/bhht-datascape

## Dependencies

The building scripts relie on `python` and the static website relies on `node`.

I recommend [`nvm`](https://github.com/nvm-sh/nvm) to install `node`. And [`pyenv`](https://github.com/pyenv/pyenv-installer) to cleanly manage a `python` environment. But any will (virtualenv, conda, miniconda, spyder etc.).

## Building the necessary data files

First you will need to install the required python dependencies using `pip` in the desired `python` environment:

```bash
pip install -r requirements.txt
```

Then run the aggregation script thusly:

```bash
python scripts/aggregate.py <path-to-data.csv>
```

## Developing the static website

After having built the necessary data files, you will first need to install `npm` dependencies:

```bash
npm install
```

Then you can develop the website (whose code is in the [src](./src) folder) thusly:

```bash
npm run dev
```

The dev version of the app will then be served on [http://localhost:3000](http://localhost:3000).
