import jitiFactory from 'jiti';
import { transform } from 'sucrase';

let jiti: ReturnType<typeof jitiFactory> | null = null;
function lazyJiti() {
  return (
    jiti ??
    (jiti = jitiFactory(__filename, {
      interopDefault: true,
      transform: (opts) => {
        return transform(opts.source, {
          transforms: ['typescript', 'imports'],
        });
      },
    }))
  );
}

export function loadConf<T>(path: string): T {
  let config = (function () {
    try {
      return path ? require(path) : {};
    } catch {
      return lazyJiti()(path);
    }
  })();
  return config.default ?? config;
}

export function importDefault<T>(filepath: string): T {
  return loadConf<T>(filepath);
}