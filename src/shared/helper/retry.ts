export const retry = async <T extends { status: number }>(
  operationPromise: Promise<T>
): Promise<T> => {
  const maximum = 3;

  let result: T;

  for (let retry = 1; retry <= maximum; retry++) {
    result = await Promise.resolve(operationPromise);

    if (result.status < 500 || retry >= maximum) return result;

    await new Promise((resolve) => setTimeout(resolve, rand(500, 1500)));
  }

  return result!;
};

const rand = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
