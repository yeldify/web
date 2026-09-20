## Escopo

<!-- O que este PR faz (só o card). Fora de escopo vira follow-up. -->

## Provas (cole a saída real — checkbox sem evidência não vale)

- [ ] **Base sincronizada** — `git rev-list --count HEAD..origin/main` tem que ser `0`:

  ```
  <!-- colar saída -->
  ```

- [ ] **Build verde** — `npm run build` (tsc + vite) em `web/`:

  ```
  <!-- colar saída -->
  ```

- [ ] **Exibição/UX conferida** — navegou no fluxo afetado em `npm run dev` (proxy `/api`):

  ```
  <!-- descrever o que foi verificado -->
  ```

## Follow-ups

<!-- ideias fora do escopo que ficam para depois (se houver) -->

## Regras

- [ ] Sem rodapé de IA no commit/PR
- [ ] Contrato com a API atualizado em `src/api/types.ts` (se necessário)
- [ ] Não mexi em CI/infra