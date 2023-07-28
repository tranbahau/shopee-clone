import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Schema, schema } from 'src/utils/rules';

import useQueryConfig from './useQueryConfig';
import { omit } from 'lodash';
import { path } from 'src/constant/path';

type FormData = Pick<Schema, 'name'>;
const nameSchema = schema.pick(['name']);

export default function useSearchProducts() {
  const queryConfig = useQueryConfig();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  });

  const handleSearchProduct = handleSubmit((data) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.name
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          name: data.name
        };

    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString()
    });
  });

  return { register, handleSearchProduct };
}
