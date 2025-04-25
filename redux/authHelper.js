import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { loginReducer, logoutReducer } from './authSlice';


/**
 * // falsy : null, 빈문자,undefined , 0 ,NaN 
 *  //기존방식 (OR 연산자 사용) - 왼쪽 데이터가 falsy일때 오른쪽데이터 실행
 * const userName = user.name || 'Guest';
 * 
 * 
 * // Nullish 병합 연산자 사용 - 왼쪽 데이터가 null 또는 undefined일때만 오른쪽 데이터 실행
 * const username = user.name ?? 'Guest';
 * 
 */




//토큰에서 로그인한 회원 email  추출
//토큰에서 email 못 빼면 리턴 null , 있으면 email반환 
export const getUserSubFromToken = (token) => {
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    // const result = '';
    // if(decoded !== null && decoded !== undefined){
      
    //   result =decoded.name;
    // }
    // else{
    //   result =null;
    // }


    // ? : 옵셔널 체이닝 연산자
        //decoded 가 null 또는 undefined -> undefined
    return decoded?.sub || null; 
          
  } 
  catch (error) {
    console.log('jwtDecode 실패:', error);
    return null;
  }
};

export const getUserRoleFromToken = (token) => {
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded?.role || null;
  } 
  catch (error) {
    console.log('jwtDecode 실패:', error);
    return null;
  }
};



export const getUserNameFromToken = (token) => {
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded?.userName || null;
  } 
  catch (error) {
    console.log('jwtDecode 실패:', error);
    return null;
  }
};
