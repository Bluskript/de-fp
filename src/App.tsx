import {
  keypairIdentity,
  Metaplex,
  mockStorage,
  useMetaplexFileFromBrowser,
} from "@metaplex-foundation/js";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import {
  Component,
  createResource,
  createSignal,
  For,
  Show,
  Suspense,
} from "solid-js";
import { css } from "vite-plugin-inline-css-modules";
import IconAccountPlus from "~icons/mdi/plus";

const classes = css`
  .caption {
    @apply text-sm text-gray-400;
  }
`;

const App: Component = () => {
  const [avatars, setAvatars] = createSignal<string[] | undefined>(undefined);
  const connection = new Connection(clusterApiUrl("devnet"));
  let wallet: Keypair | undefined;
  let client: Metaplex | undefined;
  const [connected, setConnected] = createSignal(false);
  let uploadButton: HTMLInputElement | undefined = undefined;

  const onConnect = async () => {
    wallet = Keypair.generate();
    client = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(mockStorage());
    setConnected(true);
  };

  const newDavatar = async (ev: InputEvent) => {
    const browserFile = (ev.target as HTMLInputElement).files[0];
    const file = await useMetaplexFileFromBrowser(browserFile);
    const result = await client.storage().upload(file);
  };

  const [nfts] = createResource(client, async () => {
    return client.nfts().findAllByOwner(wallet!.publicKey);
  });

  return (
    <div class="w-full h-full flex items-center justify-center">
      <div class="w-prose bg-surface-300 p-3">
        <button class="btn mb-3" onClick={onConnect}>
          Connect Wallet
        </button>
        <div class="bg-surface-400 p-4 text-center">
          <Show
            when={connected()}
            fallback={
              <span class={classes.caption}>Connect the wallet to start</span>
            }
          >
            <Suspense
              fallback={<span class={classes.caption}>Loading...</span>}
            >
              <For each={nfts()}>
                {(nft) => <span class={classes.caption}>{nft.name}</span>}
              </For>
              <button
                onClick={() => uploadButton.click()}
                class="flex items-center justify-center p-8 rounded-md border-3 border-opacity-30 border-contrast border-dashed hover:bg-surface-300"
              >
                <IconAccountPlus />
              </button>
              <input
                type="file"
                class="hidden"
                ref={uploadButton}
                accept="image/*"
                onInput={newDavatar}
              />
            </Suspense>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default App;
